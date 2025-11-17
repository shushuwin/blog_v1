from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..utils.database import get_db
from ..schemas.project import ProjectCreate, ProjectUpdate, ProjectOut, ProjectContentUpload, ProjectContentResponse
from ..services.project_service import create_project, update_project, get_project, list_projects, delete_project, read_content
from ..core.security import get_admin_user
from ..core.config import settings
from jose import jwt
import bcrypt
from fastapi import Header, HTTPException
import markdown
from ..services.file_service import save_markdown_upload

router = APIRouter()

@router.get('/')
def query(page: int = 1, limit: int = 10, db: Session = Depends(get_db)):
    data = list_projects(db, page, limit)
    items = [ProjectOut.model_validate(i) for i in data['items']]
    return {"items": items, "total": data['total']}

@router.post('/')
def create(data: ProjectCreate, db: Session = Depends(get_db), user = Depends(get_admin_user)):
    p = create_project(db, author_id=1, data=data, content='')
    return ProjectOut.model_validate(p)

@router.get('/{pid}')
def detail(pid: int, db: Session = Depends(get_db)):
    p = get_project(db, pid)
    if not p:
        return {}
    return ProjectOut.model_validate(p)

@router.put('/{pid}')
def update(pid: int, data: ProjectUpdate, db: Session = Depends(get_db), user = Depends(get_admin_user)):
    p = update_project(db, pid, data)
    if not p:
        return {}
    return ProjectOut.model_validate(p)

@router.delete('/{pid}')
def remove(pid: int, db: Session = Depends(get_db), user = Depends(get_admin_user)):
    ok = delete_project(db, pid)
    return {"success": ok}

def create_project_access_token(project_id: int):
    return jwt.encode({"project_id": project_id}, settings.jwt_secret, algorithm=settings.jwt_algorithm)

@router.get('/{pid}/content', response_model=ProjectContentResponse)
def content(pid: int, authorization: str | None = Header(default=None), db: Session = Depends(get_db)):
    p = get_project(db, pid)
    if not p:
        raise HTTPException(status_code=404, detail="项目不存在")
    if getattr(p, 'is_protected', False):
        if not authorization or not authorization.lower().startswith('bearer '):
            raise HTTPException(status_code=401, detail="缺少访问令牌")
        token = authorization.split(' ', 1)[1]
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        if payload.get('project_id') != pid:
            raise HTTPException(status_code=403, detail="令牌不匹配")
    text = read_content(db, pid)
    html = markdown.markdown(text, extensions=["tables", "fenced_code"])
    return {"content": html}

@router.post('/{pid}/markdown')
def upload_markdown(pid: int, data: ProjectContentUpload, db: Session = Depends(get_db), user = Depends(get_admin_user)):
    p = get_project(db, pid)
    if not p:
        return {}
    from ..core.config import settings
    import os
    root = settings.upload_dir
    d = os.path.join(root, 'markdown')
    os.makedirs(d, exist_ok=True)
    name = f"project_{pid}_{os.urandom(6).hex()}.md"
    path = os.path.join(d, name)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(data.content)
    p.content_path = path
    db.commit()
    db.refresh(p)
    return {"success": True}

@router.post('/upload')
def upload_markdown_file(
    file: UploadFile = File(...),
    name: str | None = Form(None),
    description: str | None = Form(None),
    uploader_name: str | None = Form(None),
    tags: str | None = Form(None),
    is_published: bool = Form(True),
    is_protected: bool = Form(False),
    password: str | None = Form(None),
    db: Session = Depends(get_db),
    user = Depends(get_admin_user)
):
    path, md5 = save_markdown_upload(file)
    data = ProjectCreate(name=name or file.filename, description=description, demo_url=None, source_url=None, cover_image=None)
    p = create_project(db, author_id=1, data=data, content=None)
    p.content_path = path
    if uploader_name:
        p.uploader_name = uploader_name
    p.is_published = is_published
    if is_protected and password:
        p.is_protected = True
        p.password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    if tags:
        try:
            setattr(p, 'tags_text', tags)
        except Exception:
            pass
    db.commit()
    db.refresh(p)
    return {"id": p.id, "path": path, "md5": md5}

@router.post('/{pid}/access')
def project_access(pid: int, password: str = Form(...), db: Session = Depends(get_db)):
    p = get_project(db, pid)
    if not p or not getattr(p, 'is_protected', False) or not getattr(p, 'password_hash', None):
        raise HTTPException(status_code=404, detail="项目不可访问或未设置密码")
    if not bcrypt.checkpw(password.encode(), p.password_hash.encode()):
        raise HTTPException(status_code=401, detail="密码错误")
    token = create_project_access_token(pid)
    return {"project_access_token": token}