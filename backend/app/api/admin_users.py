from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..utils.database import get_db
from ..core.security import get_admin_user
from ..core.config import settings
from ..models.user import User

router = APIRouter()

@router.get('/')
def list_users(db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    items = db.query(User).order_by(User.created_at.desc()).all()
    return [{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "created_at": u.created_at,
        "is_admin": u.username == settings.admin_username,
    } for u in items]

@router.delete('/{uid}')
def delete_user(uid: int, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    target = db.query(User).get(uid)
    if not target:
        raise HTTPException(status_code=404, detail="用户不存在")
    if target.username == settings.admin_username:
        raise HTTPException(status_code=400, detail="不可删除管理员账户")
    db.delete(target)
    db.commit()
    return {"success": True}

@router.put('/{uid}/role')
def update_role(uid: int, is_admin: bool, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    target = db.query(User).get(uid)
    if not target:
        raise HTTPException(status_code=404, detail="用户不存在")
    # 系统仅支持单一管理员（settings.admin_username）
    raise HTTPException(status_code=400, detail="不支持更改管理员权限")