from sqlalchemy.orm import Session
from sqlalchemy import select
from ..models.project import Project
from ..core.config import settings
import os

def create_project(db: Session, author_id: int, data, content: str | None):
    content_path = None
    if content:
        root = settings.upload_dir
        d = os.path.join(root, 'markdown')
        os.makedirs(d, exist_ok=True)
        name = f"project_{author_id}_{os.urandom(6).hex()}.md"
        content_path = os.path.join(d, name)
        with open(content_path, 'w', encoding='utf-8') as f:
            f.write(content)
    proj = Project(
        name=data.name,
        description=data.description,
        demo_url=data.demo_url,
        source_url=data.source_url,
        cover_image=data.cover_image,
        author_id=author_id,
        content_path=content_path
    )
    db.add(proj)
    db.commit()
    db.refresh(proj)
    return proj

def update_project(db: Session, project_id: int, data):
    p = db.get(Project, project_id)
    if not p:
        return None
    for k in ['name','description','demo_url','source_url','cover_image']:
        v = getattr(data, k, None)
        if v is not None:
            setattr(p, k, v)
    db.commit()
    db.refresh(p)
    return p

def get_project(db: Session, project_id: int):
    return db.get(Project, project_id)

def list_projects(db: Session, page: int, limit: int):
    items = db.execute(select(Project).order_by(Project.created_at.desc()).offset((page-1)*limit).limit(limit)).scalars().all()
    total = db.query(Project).count()
    return {"items": items, "total": total}

def delete_project(db: Session, project_id: int):
    p = db.get(Project, project_id)
    if not p:
        return False
    db.delete(p)
    db.commit()
    return True

def read_content(db: Session, project_id: int):
    p = db.get(Project, project_id)
    if not p or not p.content_path:
        return ''
    with open(p.content_path, 'r', encoding='utf-8') as f:
        return f.read()