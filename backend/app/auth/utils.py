import hashlib
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
from ..config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# Used to burn the same CPU time when the email doesn't exist (no timing leak)
_DUMMY_HASH = pwd_context.hash("not-a-real-password")
MIN_PASSWORD_LEN = 10


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


def burn_password_check(plain: str):
    pwd_context.verify(plain, _DUMMY_HASH)


def get_password_hash(password):
    return pwd_context.hash(password)


def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def create_access_token(data: dict):
    to_encode = data.copy()
    now = datetime.utcnow()
    to_encode.update({"exp": now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES), "iat": now})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM], options={"require": ["exp"]})
