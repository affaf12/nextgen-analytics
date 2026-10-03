from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from sqlalchemy.orm import Session

from ..database import get_db
from .models import User
from .utils import decode_access_token

bearer_scheme = HTTPBearer(auto_error=False)

UNAUTHORIZED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Not authenticated",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise UNAUTHORIZED
    try:
        payload = decode_access_token(credentials.credentials)
    except jwt.PyJWTError:
        raise UNAUTHORIZED
    email = payload.get("sub")
    if not email:
        raise UNAUTHORIZED
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise UNAUTHORIZED
    # Logout / password change / reset bump token_version -> older tokens are dead
    if payload.get("tv", 0) != (user.token_version or 0):
        raise UNAUTHORIZED
    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Only role == 'Admin' (owner) - used for Team management and ERP."""
    if (current_user.role or "").lower() != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
