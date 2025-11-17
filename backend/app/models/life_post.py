from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from ..utils.database import Base

class LifePost(Base):
    __tablename__ = "life_posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    summary = Column(String(500), nullable=True)
    content_path = Column(String(500), nullable=True)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)