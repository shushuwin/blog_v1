from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import jwt
from ..core.config import settings
from ..utils.database import get_db
from ..models.user import User

scheme = HTTPBearer(auto_error=True)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(scheme), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=401)
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(status_code=401)
    return user

def get_admin_user(user: User = Depends(get_current_user)):
    return user