from sqlalchemy.orm import Session
from ..models.user import User
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from ..core.config import settings

def authenticate(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None
    if not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
        return None
    payload = {"sub": str(user.id), "exp": datetime.utcnow() + timedelta(seconds=settings.jwt_expires)}
    token = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return token