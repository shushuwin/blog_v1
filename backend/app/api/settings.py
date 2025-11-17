from fastapi import APIRouter
from ..core.config import settings

router = APIRouter()

@router.get('/')
def get_settings():
    return {"upload_dir": settings.upload_dir, "model_path": settings.model_path}