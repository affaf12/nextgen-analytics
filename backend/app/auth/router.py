import secrets
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..security import client_ip, limiter, rate_limit
from .dependencies import get_current_user, require_admin
from .email import send_reset_email
from .models import User, AuditLog
from . import totp
from .utils import (MIN_PASSWORD_LEN, burn_password_check, create_access_token,
                    get_password_hash, hash_token, verify_password)

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])

ROLES = {"Admin", "Staff"}
LOGIN_WINDOW = 15 * 60
MAX_FAILS_PER_EMAIL = 5
MAX_ATTEMPTS_PER_IP = 20


class LoginIn(BaseModel):
    email: str = Field(max_length=254)
    password: str = Field(max_length=200)
    otp: Optional[str] = Field(default=None, max_length=10)


class ChangePasswordIn(BaseModel):
    current_password: str = Field(max_length=200)
    new_password: str = Field(max_length=200)


class OtpIn(BaseModel):
    code: str = Field(max_length=10)


class OtpDisableIn(BaseModel):
    password: str = Field(max_length=200)
    code: str = Field(max_length=10)


def audit(db: Session, event: str, email: Optional[str], request: Request, detail: str = ""):
    db.add(AuditLog(event=event, email=email, ip=client_ip(request), detail=detail[:500]))
    db.commit()


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(max_length=200)
    role: Optional[str] = "Staff"


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str

    class Config:
        from_attributes = True


class ForgotPasswordIn(BaseModel):
    email: EmailStr


class ResetPasswordIn(BaseModel):
    token: str = Field(max_length=200)
    new_password: str = Field(max_length=200)


def _check_password_strength(pw: str):
    if len(pw) < MIN_PASSWORD_LEN:
        raise HTTPException(status_code=400, detail=f"Password must be at least {MIN_PASSWORD_LEN} characters")
    if pw.lower() in {"admin123", "password123", "1234567890", "qwertyuiop"}:
        raise HTTPException(status_code=400, detail="That password is too common")


@router.post("/login", response_model=TokenOut)
def login(data: LoginIn, request: Request, db: Session = Depends(get_db)):
    ip_key = f"login-ip:{client_ip(request)}"
    email_key = f"login-fail:{data.email.strip().lower()}"
    if limiter.count(ip_key, LOGIN_WINDOW) >= MAX_ATTEMPTS_PER_IP or \
       limiter.count(email_key, LOGIN_WINDOW) >= MAX_FAILS_PER_EMAIL:
        audit(db, "login_blocked", data.email[:254], request, "rate limit")
        raise HTTPException(status_code=429, detail="Too many login attempts. Try again in 15 minutes.")
    limiter.record(ip_key)

    user = db.query(User).filter(User.email == data.email.strip()).first()
    if not user:
        burn_password_check(data.password)
    if not user or not verify_password(data.password, user.hashed_password):
        limiter.record(email_key)
        audit(db, "login_fail", data.email[:254], request)
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.totp_enabled:
        if not data.otp:
            raise HTTPException(status_code=401, detail="otp_required")
        step = totp.verify(user.totp_secret, data.otp, user.totp_last_step)
        if step is None:
            limiter.record(email_key)
            audit(db, "otp_fail", user.email, request)
            raise HTTPException(status_code=401, detail="Invalid credentials")
        user.totp_last_step = step

    audit(db, "login_ok", user.email, request)
    token = create_access_token({"sub": user.email, "id": user.id, "tv": user.token_version or 0})
    return {"access_token": token, "token_type": "bearer",
            "user": {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role}}


@router.get("/me")
def me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email,
            "full_name": current_user.full_name, "role": current_user.role,
            "totp_enabled": bool(current_user.totp_enabled)}


@router.post("/logout")
def logout(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Kills this token AND every other token of the account (server-side)."""
    current_user.token_version = (current_user.token_version or 0) + 1
    db.commit()
    audit(db, "logout", current_user.email, request)
    return {"ok": True}


@router.post("/change-password")
def change_password(payload: ChangePasswordIn, request: Request, db: Session = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password is wrong")
    _check_password_strength(payload.new_password)
    current_user.hashed_password = get_password_hash(payload.new_password)
    current_user.token_version = (current_user.token_version or 0) + 1
    db.commit()
    audit(db, "password_changed", current_user.email, request)
    token = create_access_token({"sub": current_user.email, "id": current_user.id, "tv": current_user.token_version})
    return {"access_token": token, "token_type": "bearer"}


# ---------- 2FA (TOTP) ----------

@router.post("/2fa/setup", dependencies=[Depends(rate_limit("2fa-setup", 10, 3600))])
def twofa_setup(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.totp_enabled:
        raise HTTPException(status_code=400, detail="2FA is already enabled")
    secret = totp.new_secret()
    current_user.totp_secret = secret
    db.commit()
    return {"secret": secret, "otpauth_uri": totp.provisioning_uri(secret, current_user.email)}


@router.post("/2fa/enable", dependencies=[Depends(rate_limit("2fa-enable", 10, 3600))])
def twofa_enable(payload: OtpIn, request: Request, db: Session = Depends(get_db),
                 current_user: User = Depends(get_current_user)):
    if not current_user.totp_secret:
        raise HTTPException(status_code=400, detail="Start 2FA setup first")
    step = totp.verify(current_user.totp_secret, payload.code)
    if step is None:
        raise HTTPException(status_code=400, detail="Wrong code - check your phone's clock and try again")
    current_user.totp_enabled = True
    current_user.totp_last_step = step
    db.commit()
    audit(db, "2fa_enabled", current_user.email, request)
    return {"ok": True}


@router.post("/2fa/disable", dependencies=[Depends(rate_limit("2fa-disable", 10, 3600))])
def twofa_disable(payload: OtpDisableIn, request: Request, db: Session = Depends(get_db),
                  current_user: User = Depends(get_current_user)):
    if not current_user.totp_enabled:
        raise HTTPException(status_code=400, detail="2FA is not enabled")
    if not verify_password(payload.password, current_user.hashed_password) or \
       totp.verify(current_user.totp_secret, payload.code, current_user.totp_last_step) is None:
        raise HTTPException(status_code=400, detail="Password or code is wrong")
    current_user.totp_enabled = False
    current_user.totp_secret = None
    db.commit()
    audit(db, "2fa_disabled", current_user.email, request)
    return {"ok": True}


@router.get("/audit")
def audit_log(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    rows = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(200).all()
    return [{"time": r.created_at, "event": r.event, "email": r.email, "ip": r.ip, "detail": r.detail} for r in rows]


# ---------- team members (Admin role only) ----------

@router.get("/users", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(User).order_by(User.created_at.asc()).all()


@router.post("/users", response_model=UserOut)
def create_user(payload: UserCreate, request: Request, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    role = payload.role or "Staff"
    if role not in ROLES:
        raise HTTPException(status_code=400, detail="Role must be Admin or Staff")
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="A user with this email already exists")
    _check_password_strength(payload.password)
    user = User(
        email=payload.email,
        full_name=payload.full_name.strip(),
        hashed_password=get_password_hash(payload.password),
        is_admin=(role == "Admin"),
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    audit(db, "user_created", admin.email, request, f"{user.email} ({role})")
    return user


@router.delete("/users/{user_id}")
def delete_user(user_id: int, request: Request, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You can't delete your own account while logged in as it")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role == "Admin" and db.query(User).filter(User.role == "Admin").count() <= 1:
        raise HTTPException(status_code=400, detail="Can't delete the last remaining Admin")
    gone = user.email
    db.delete(user)
    db.commit()
    audit(db, "user_deleted", current_user.email, request, gone)
    return {"ok": True}


# ---------- forgot / reset password ----------

@router.post("/forgot-password", dependencies=[Depends(rate_limit("forgot", 3, 3600))])
def forgot_password(payload: ForgotPasswordIn, request: Request, db: Session = Depends(get_db)):
    generic = {"message": "Agar ye email registered hai, to reset link bhej diya gaya hai."}
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        return generic
    token = secrets.token_urlsafe(32)
    user.reset_token = hash_token(token)  # only the hash is stored
    user.reset_token_expires = datetime.utcnow() + timedelta(minutes=30)
    db.commit()
    audit(db, "password_reset_requested", user.email, request)
    send_reset_email(user.email, f"{settings.ADMIN_URL.rstrip('/')}/reset-password?token={token}")
    return generic


@router.post("/reset-password", dependencies=[Depends(rate_limit("reset", 10, 3600))])
def reset_password(payload: ResetPasswordIn, request: Request, db: Session = Depends(get_db)):
    _check_password_strength(payload.new_password)
    user = db.query(User).filter(User.reset_token == hash_token(payload.token)).first()
    if not user or not user.reset_token_expires or user.reset_token_expires < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Reset link is invalid or has expired")
    user.hashed_password = get_password_hash(payload.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    user.token_version = (user.token_version or 0) + 1   # kill all existing sessions
    db.commit()
    audit(db, "password_reset", user.email, request)
    return {"message": "Password reset ho gaya. Ab naye password se login karein."}
