from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..utils.database import get_db
from ..schemas.life import LifeCreate, LifeUpdate, LifeOut, LifeContentUpload, LifeContentResponse
from ..services.life_service import create_life, update_life, get_life, list_life, delete_life, read_content
from ..core.security import get_admin_user
import markdown

router = APIRouter()

@router.get('/')
def query(page: int = 1, limit: int = 10, db: Session = Depends(get_db)):
    data = list_life(db, page, limit)
    items = [LifeOut.model_validate(i) for i in data['items']]
    return {"items": items, "total": data['total']}

@router.post('/')
def create(data: LifeCreate, db: Session = Depends(get_db), user = Depends(get_admin_user)):
    lp = create_life(db, data, content='')
    return LifeOut.model_validate(lp)

@router.get('/{lid}')
def detail(lid: int, db: Session = Depends(get_db)):
    lp = get_life(db, lid)
    if not lp:
        return {}
    return LifeOut.model_validate(lp)

@router.put('/{lid}')
def update(lid: int, data: LifeUpdate, db: Session = Depends(get_db), user = Depends(get_admin_user)):
    lp = update_life(db, lid, data)
    if not lp:
        return {}
    return LifeOut.model_validate(lp)

@router.delete('/{lid}')
def remove(lid: int, db: Session = Depends(get_db), user = Depends(get_admin_user)):
    ok = delete_life(db, lid)
    return {"success": ok}

@router.get('/{lid}/content', response_model=LifeContentResponse)
def content(lid: int, db: Session = Depends(get_db)):
    text = read_content(db, lid)
    html = markdown.markdown(text, extensions=["tables", "fenced_code"])
    return {"content": html}

@router.post('/{lid}/markdown')
def upload_markdown(lid: int, data: LifeContentUpload, db: Session = Depends(get_db), user = Depends(get_admin_user)):
    lp = get_life(db, lid)
    if not lp:
        return {}
    from ..core.config import settings
    import os
    root = settings.upload_dir
    d = os.path.join(root, 'markdown')
    os.makedirs(d, exist_ok=True)
    name = f"life_{lid}_{os.urandom(6).hex()}.md"
    path = os.path.join(d, name)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(data.content)
    lp.content_path = path
    db.commit()
    db.refresh(lp)
    return {"success": True}
@router.put('/{lid}/publish')
def toggle_publish(lid: int, is_published: bool, db: Session = Depends(get_db), user = Depends(get_admin_user)):
    lp = get_life(db, lid)
    if not lp:
        return {"success": False}
    lp.is_published = is_published
    db.commit()
    return {"success": True}