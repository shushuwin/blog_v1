from fastapi import APIRouter, Depends, Body, Header, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..utils.database import get_db
from ..schemas.post import PostCreate, PostUpdate, PostOut, PostContentResponse, PostAccessRequest, PostAccessToken, PostContentUpload
from ..services.post_service import create_post, update_post, get_post, list_posts, delete_post, read_content, verify_post_password
from typing import Any
from jose import jwt
from ..core.config import settings
from ..core.security import get_admin_user
import markdown
from ..services.file_service import save_markdown_upload

router = APIRouter()

def create_post_access_token(post_id: int):
    return jwt.encode({"post_id": post_id}, settings.jwt_secret, algorithm=settings.jwt_algorithm)

@router.get('/latest')
def latest(limit: int = 6, db: Session = Depends(get_db)):
    from ..models.post import Post
    from ..models.tag import Tag
    from ..models.post_tag import PostTag
    q = db.query(Post).filter(Post.is_published == True).order_by(Post.created_at.desc()).limit(limit).all()
    items = []
    for p in q:
        tag_ids = db.query(PostTag.tag_id).filter(PostTag.post_id == p.id).all()
        ids = [tid for (tid,) in tag_ids]
        tags = db.query(Tag).filter(Tag.id.in_(ids)).all() if ids else []
        items.append({
            "id": p.id,
            "title": p.title,
            "summary": p.summary,
            "is_published": p.is_published,
            "is_protected": p.is_protected,
            "created_at": p.created_at,
            "uploader_name": p.uploader_name,
            "category": {"name": p.category.name} if p.category else None,
            "author": {"username": p.author.username} if p.author else None,
            "tags": [{"id": t.id, "name": t.name} for t in tags],
        })
    return items

@router.get('/')
def query(page: int = 1, limit: int = 10, tag: str | None = None, db: Session = Depends(get_db)):
    data = list_posts(db, page, limit, tag=tag)
    items = [PostOut.model_validate(i) for i in data["items"]]
    return {"items": items, "total": data["total"]}

@router.post('/')
def create(data: PostCreate, db: Session = Depends(get_db), user: Any = Depends(get_admin_user)):
    post = create_post(db, author_id=1, data=data, content="")
    return PostOut.model_validate(post)

@router.get('/{post_id}')
def detail(post_id: int, db: Session = Depends(get_db)):
    post = get_post(db, post_id)
    if not post:
        return {}
    return PostOut.model_validate(post)

@router.put('/{post_id}')
def update(post_id: int, data: PostUpdate, db: Session = Depends(get_db), user: Any = Depends(get_admin_user)):
    post = update_post(db, post_id, data)
    if not post:
        return {}
    return PostOut.model_validate(post)

@router.delete('/{post_id}')
def remove(post_id: int, db: Session = Depends(get_db), user: Any = Depends(get_admin_user)):
    ok = delete_post(db, post_id)
    return {"success": ok}

@router.get('/{post_id}/content', response_model=PostContentResponse)
def content(post_id: int, db: Session = Depends(get_db), authorization: str | None = Header(None)):
    post = get_post(db, post_id)
    if not post:
        return {"content": ""}
    if post.is_protected:
        if not authorization or not authorization.startswith("Bearer "):
            return {"content": ""}
        token = authorization.split(" ", 1)[1]
        try:
            payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
            if payload.get("post_id") != post_id:
                return {"content": ""}
        except Exception:
            return {"content": ""}
    content_text = read_content(db, post_id)
    html = markdown.markdown(content_text, extensions=["tables", "fenced_code"])
    return {"content": html}

@router.post('/{post_id}/access', response_model=PostAccessToken)
def access(post_id: int, data: PostAccessRequest, db: Session = Depends(get_db)):
    ok = verify_post_password(db, post_id, data.password)
    if not ok:
        return {"post_access_token": ""}
    token = create_post_access_token(post_id)
    return {"post_access_token": token}

@router.post('/{post_id}/markdown')
def upload_markdown(post_id: int, data: PostContentUpload, db: Session = Depends(get_db), user: Any = Depends(get_admin_user)):
    post = get_post(db, post_id)
    if not post:
        return {}
    updated = update_post(db, post_id, PostUpdate())
    from ..services.post_service import create_post as cp
    from ..core.config import settings
    import os
    upload_root = settings.upload_dir
    markdown_dir = os.path.join(upload_root, "markdown")
    os.makedirs(markdown_dir, exist_ok=True)
    filename = f"post_{post_id}_{os.urandom(6).hex()}.md"
    content_path = os.path.join(markdown_dir, filename)
    with open(content_path, "w", encoding="utf-8") as f:
        f.write(data.content)
    post.content_path = content_path
    db.commit()
    db.refresh(post)
    return {"success": True}

@router.post('/upload')
def upload_markdown_file(file: UploadFile = File(...), title: str | None = Form(None), is_published: bool = Form(True), is_protected: bool = Form(False), password: str | None = Form(None), tags: str | None = Form(None), uploader_name: str | None = Form(None), db: Session = Depends(get_db), user: Any = Depends(get_admin_user)):
    path, md5 = save_markdown_upload(file)
    tag_list = [t.strip() for t in (tags or '').split(',') if t.strip()] or None
    # 自动归类到“笔记分享”
    from ..models.category import Category
    cat = db.query(Category).filter(Category.slug == 'notes').first()
    cat_id = cat.id if cat else None
    post = create_post(db, author_id=1, data=PostCreate(title=title or file.filename, summary=None, category_id=cat_id, is_published=is_published, is_protected=is_protected, password=password, tags=tag_list), content=None)
    post.content_path = path
    if uploader_name:
        post.uploader_name = uploader_name
    db.commit()
    db.refresh(post)
    return {"id": post.id, "path": path, "md5": md5}
@router.put('/{post_id}/publish')
def toggle_publish(post_id: int, is_published: bool, db: Session = Depends(get_db), user: Any = Depends(get_admin_user)):
    post = get_post(db, post_id)
    if not post:
        return {"success": False}
    post.is_published = is_published
    db.commit()
    return {"success": True}