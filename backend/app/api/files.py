from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from ..services.file_service import save_upload, save_image_upload
from ..services.tools_service import engine
from ..core.security import get_admin_user, get_current_user
from ..utils.database import get_db

router = APIRouter()

@router.post('/upload')
def upload(file: UploadFile = File(...), user = Depends(get_admin_user)):
    path, md5 = save_upload(file, 'assets')
    return {"path": path, "md5": md5}

@router.post('/scan')
async def scan(file: UploadFile = File(...), user = Depends(get_current_user)):
    content = await file.read()
    label, confidence = engine.predict(content)
    return {"label": label, "confidence": confidence}

@router.post('/upload-image')
def upload_image(file: UploadFile = File(...), user = Depends(get_admin_user)):
    path, md5 = save_image_upload(file)
    return {"path": path, "md5": md5}