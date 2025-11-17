from sqlalchemy.orm import Session
from sqlalchemy import select
from ..models.life_post import LifePost
from ..core.config import settings
import os

def create_life(db: Session, data, content: str | None):
    content_path = None
    if content:
        root = settings.upload_dir
        d = os.path.join(root, 'markdown')
        os.makedirs(d, exist_ok=True)
        name = f"life_{os.urandom(6).hex()}.md"
        content_path = os.path.join(d, name)
        with open(content_path, 'w', encoding='utf-8') as f:
            f.write(content)
    lp = LifePost(
        title=data.title,
        summary=data.summary,
        is_published=data.is_published,
        content_path=content_path
    )
    db.add(lp)
    db.commit()
    db.refresh(lp)
    return lp

def update_life(db: Session, life_id: int, data):
    lp = db.get(LifePost, life_id)
    if not lp:
        return None
    for k in ['title','summary','is_published']:
        v = getattr(data, k, None)
        if v is not None:
            setattr(lp, k, v)
    db.commit()
    db.refresh(lp)
    return lp

def get_life(db: Session, life_id: int):
    return db.get(LifePost, life_id)

def list_life(db: Session, page: int, limit: int):
    base = db.query(LifePost).filter(LifePost.is_published == True)
    total = base.count()
    items = base.order_by(LifePost.created_at.desc()).offset((page-1)*limit).limit(limit).all()
    return {"items": items, "total": total}

def delete_life(db: Session, life_id: int):
    lp = db.get(LifePost, life_id)
    if not lp:
        return False
    db.delete(lp)
    db.commit()
    return True

def read_content(db: Session, life_id: int):
    lp = db.get(LifePost, life_id)
    if not lp or not lp.content_path:
        return ''
    with open(lp.content_path, 'r', encoding='utf-8') as f:
        return f.read()