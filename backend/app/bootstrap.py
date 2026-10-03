"""First-run admin creation (replaces the old public /auth/seed endpoint)
and a production safety check for leftover default credentials."""
import secrets
from sqlalchemy.orm import Session
from .auth.models import User
from .auth.utils import get_password_hash, verify_password, MIN_PASSWORD_LEN
from .config import settings


def bootstrap_admin(db: Session):
    # Refuse to run in production with the old well-known default login
    legacy = db.query(User).filter(User.email == "admin@nextgenanalytics.cloud-ip.cc").first()
    if legacy and verify_password("admin123", legacy.hashed_password):
        msg = ("The default admin password 'admin123' is still active. "
               "Log in locally and change it (Forgot Password), or delete agency.db.")
        if settings.is_production:
            raise RuntimeError(msg)
        print("=" * 60 + f"\n[SECURITY WARNING] {msg}\n" + "=" * 60)

    if db.query(User).count() > 0:
        return

    password = settings.ADMIN_PASSWORD
    generated = False
    if not password:
        if settings.is_production:
            print("[WARN] No users exist and ADMIN_PASSWORD is not set - nobody can log in. "
                  "Set ADMIN_EMAIL + ADMIN_PASSWORD once, redeploy, then remove ADMIN_PASSWORD.")
            return
        password, generated = secrets.token_urlsafe(12), True
    elif len(password) < MIN_PASSWORD_LEN:
        raise RuntimeError(f"ADMIN_PASSWORD must be at least {MIN_PASSWORD_LEN} characters")

    db.add(User(email=settings.ADMIN_EMAIL, full_name=settings.ADMIN_NAME,
                hashed_password=get_password_hash(password), is_admin=True, role="Admin"))
    db.commit()
    if generated:
        print("=" * 60)
        print("[DEV] First admin created. Login (shown only once):")
        print(f"      email:    {settings.ADMIN_EMAIL}")
        print(f"      password: {password}")
        print("=" * 60)
