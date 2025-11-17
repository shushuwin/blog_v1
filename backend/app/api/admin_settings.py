from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..utils.database import get_db
from ..models.setting import Setting
from ..core.security import get_admin_user

router = APIRouter()

@router.put('/')
def set_settings(items: dict, db: Session = Depends(get_db), user = Depends(get_admin_user)):
    for k, v in items.items():
        s = db.query(Setting).filter(Setting.key == k).first()
        if not s:
            s = Setting(key=k, value=str(v))
            db.add(s)
        else:
            s.value = str(v)
    db.commit()
    return {"success": True}