from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from ..utils.database import get_db
from ..models.tag import Tag
from ..models.post import Post
from ..models.post_tag import PostTag

router = APIRouter()

@router.get('/')
def list_tags(db: Session = Depends(get_db)):
    counts = db.query(PostTag.tag_id, func.count(PostTag.id)).group_by(PostTag.tag_id).all()
    count_map = {tid: c for tid, c in counts}
    tags = db.query(Tag).order_by(Tag.name.asc()).all()
    return [{"id": t.id, "name": t.name, "slug": t.slug, "count": count_map.get(t.id, 0)} for t in tags]

@router.get('/{slug}/posts')
def posts_by_tag(slug: str, page: int = 1, limit: int = 10, db: Session = Depends(get_db)):
    tag = db.query(Tag).filter(Tag.slug == slug).first()
    if not tag:
        return {"items": [], "total": 0}
    q = db.query(Post).join(PostTag, PostTag.post_id == Post.id).filter(PostTag.tag_id == tag.id).order_by(Post.created_at.desc())
    total = q.count()
    items = q.offset((page-1)*limit).limit(limit).all()
    return {"items": [{"id": p.id, "title": p.title, "summary": p.summary, "is_published": p.is_published, "is_protected": p.is_protected} for p in items], "total": total}