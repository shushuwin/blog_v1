from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..utils.database import get_db
from ..core.security import get_admin_user
from ..models.post import Post
from ..models.life_post import LifePost
from ..models.user import User

router = APIRouter()

@router.get('/')
def list_publish(db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    posts = db.query(Post).all()
    lifes = db.query(LifePost).all()
    items = []
    for p in posts:
        items.append({
            "id": p.id,
            "kind": "post",
            "title": p.title,
            "section": "笔记分享",
            "is_published": p.is_published,
            "uploader_name": p.uploader_name,
        })
    for l in lifes:
        items.append({
            "id": l.id,
            "kind": "life",
            "title": l.title,
            "section": "个人生活",
            "is_published": getattr(l, "is_published", True),
            "uploader_name": getattr(l, "uploader_name", None),
        })
    return {"items": items}

@router.put('/{kind}/{pid}/publish')
def toggle_publish(kind: str, pid: int, is_published: bool, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    if kind == 'post':
        p = db.query(Post).get(pid)
    elif kind == 'life':
        p = db.query(LifePost).get(pid)
    else:
        raise HTTPException(status_code=400, detail="未知类型")
    if not p:
        raise HTTPException(status_code=404, detail="不存在")
    setattr(p, 'is_published', is_published)
    db.commit()
    return {"success": True}

@router.delete('/{kind}/{pid}')
def delete(kind: str, pid: int, db: Session = Depends(get_db), user: User = Depends(get_admin_user)):
    if kind == 'post':
        p = db.query(Post).get(pid)
    elif kind == 'life':
        p = db.query(LifePost).get(pid)
    else:
        raise HTTPException(status_code=400, detail="未知类型")
    if not p:
        raise HTTPException(status_code=404, detail="不存在")
    db.delete(p)
    db.commit()
    return {"success": True}