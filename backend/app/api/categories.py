from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..utils.database import get_db
from ..models.category import Category

router = APIRouter()

@router.get('/')
def list_categories(db: Session = Depends(get_db)):
    items = db.query(Category).order_by(Category.sort_order.asc()).all()
    return [{"id": c.id, "name": c.name, "slug": c.slug} for c in items]