from sqlalchemy.orm import Session
from sqlalchemy import select
from ..models.post import Post
from ..models.user import User
from ..models.tag import Tag
from ..models.post_tag import PostTag
from ..core.config import settings
import bcrypt
import os

def create_post(db: Session, author_id: int, data, content: str | None):
    content_path = None
    if content is not None:
        upload_root = settings.upload_dir
        markdown_dir = os.path.join(upload_root, "markdown")
        os.makedirs(markdown_dir, exist_ok=True)
        filename = f"post_{author_id}_{os.urandom(6).hex()}.md"
        content_path = os.path.join(markdown_dir, filename)
        with open(content_path, "w", encoding="utf-8") as f:
            f.write(content)
    password_hash = None
    if data.password:
        password_hash = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    post = Post(
        title=data.title,
        summary=data.summary,
        content_path=content_path,
        author_id=author_id,
        category_id=data.category_id,
        is_published=data.is_published,
        is_protected=data.is_protected,
        password_hash=password_hash,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    if data.tags:
        for name in data.tags:
            t = db.query(Tag).filter(Tag.name == name).first()
            if not t:
                t = Tag(name=name, slug=name)
                db.add(t)
                db.commit()
                db.refresh(t)
            if not db.query(PostTag).filter(PostTag.post_id == post.id, PostTag.tag_id == t.id).first():
                db.add(PostTag(post_id=post.id, tag_id=t.id))
        db.commit()
    return post

def update_post(db: Session, post_id: int, data):
    post = db.get(Post, post_id)
    if not post:
        return None
    if data.title is not None:
        post.title = data.title
    if data.summary is not None:
        post.summary = data.summary
    if data.category_id is not None:
        post.category_id = data.category_id
    if data.is_published is not None:
        post.is_published = data.is_published
    if data.is_protected is not None:
        post.is_protected = data.is_protected
    if data.password is not None:
        post.password_hash = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    if data.tags is not None:
        db.query(PostTag).filter(PostTag.post_id == post_id).delete()
        if data.tags:
            for name in data.tags:
                t = db.query(Tag).filter(Tag.name == name).first()
                if not t:
                    t = Tag(name=name, slug=name)
                    db.add(t)
                    db.commit()
                    db.refresh(t)
                if not db.query(PostTag).filter(PostTag.post_id == post.id, PostTag.tag_id == t.id).first():
                    db.add(PostTag(post_id=post.id, tag_id=t.id))
        db.commit()
    db.commit()
    db.refresh(post)
    return post

def get_post(db: Session, post_id: int):
    return db.get(Post, post_id)

def list_posts(db: Session, page: int, limit: int, tag: str | None = None):
    if tag:
        from ..models.tag import Tag
        from ..models.post_tag import PostTag
        t = db.query(Tag).filter(Tag.slug == tag).first()
        if not t:
            return {"items": [], "total": 0}
        base = db.query(Post).join(PostTag, PostTag.post_id == Post.id).filter(PostTag.tag_id == t.id, Post.is_published == True)
        total = base.count()
        q = base.order_by(Post.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
        return {"items": q, "total": total}
    base = db.query(Post).filter(Post.is_published == True)
    total = base.count()
    q = base.order_by(Post.created_at.desc()).offset((page - 1) * limit).limit(limit).all()
    return {"items": q, "total": total}

def delete_post(db: Session, post_id: int):
    post = db.get(Post, post_id)
    if not post:
        return False
    db.delete(post)
    db.commit()
    return True

def read_content(db: Session, post_id: int):
    post = db.get(Post, post_id)
    if not post or not post.content_path:
        return ""
    with open(post.content_path, "r", encoding="utf-8") as f:
        return f.read()

def verify_post_password(db: Session, post_id: int, password: str):
    post = db.get(Post, post_id)
    if not post or not post.password_hash:
        return False
    return bcrypt.checkpw(password.encode(), post.password_hash.encode())