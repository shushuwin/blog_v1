from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..utils.database import get_db
from ..schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from ..services.auth_service import authenticate
from ..core.config import settings
from ..core.security import get_current_user
from ..models.user import User
from fastapi import HTTPException
import bcrypt

router = APIRouter()

@router.post('/login', response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    token = authenticate(db, data.username, data.password)
    if not token:
        return TokenResponse(access_token="", expires_in=0)
    return TokenResponse(access_token=token, expires_in=settings.jwt_expires)

@router.get('/me')
def me(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "avatar_url": user.avatar_url,
        "created_at": user.created_at,
        "is_admin": user.username == settings.admin_username,
    }

@router.get('/author')
def author(db: Session = Depends(get_db)):
    u = db.query(User).filter(User.username == settings.admin_username).first()
    if not u:
        return {
            "username": settings.admin_username,
            "email": settings.admin_email,
            "avatar_url": None,
            "created_at": None,
            "is_admin": True,
        }
    return {
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "avatar_url": u.avatar_url,
        "created_at": u.created_at,
        "is_admin": True,
    }

@router.post('/register', response_model=TokenResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.username == data.username).first()
    if exists:
        raise HTTPException(status_code=400, detail="用户名已存在")
    exists_email = db.query(User).filter(User.email == data.email).first()
    if exists_email:
        raise HTTPException(status_code=400, detail="邮箱已被使用")
    password_hash = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    u = User(username=data.username, email=data.email, password_hash=password_hash)
    db.add(u)
    db.commit()
    db.refresh(u)
    token = authenticate(db, data.username, data.password)
    if not token:
        raise HTTPException(status_code=500, detail="注册后登录失败")
    return TokenResponse(access_token=token, expires_in=settings.jwt_expires)