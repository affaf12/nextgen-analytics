from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from datetime import datetime
from ..database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    is_admin = Column(Boolean, default=True)
    role = Column(String, default="Admin")  # "Admin" or "Staff"
    reset_token = Column(String, nullable=True)          # SHA-256 hash only
    reset_token_expires = Column(DateTime, nullable=True)
    # Bumped on logout / password change / reset -> every older JWT dies instantly
    token_version = Column(Integer, default=0)
    # TOTP 2FA (Google Authenticator / Authy / Microsoft Authenticator)
    totp_secret = Column(String, nullable=True)
    totp_enabled = Column(Boolean, default=False)
    totp_last_step = Column(Integer, default=0)          # blocks code replay
    created_at = Column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_log"
    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    event = Column(String, index=True)
    email = Column(String, nullable=True)
    ip = Column(String, nullable=True)
    detail = Column(Text, nullable=True)
