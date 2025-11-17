from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from ..utils.database import Base

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    demo_url = Column(String(255), nullable=True)
    source_url = Column(String(255), nullable=True)
    cover_image = Column(String(255), nullable=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content_path = Column(String(500), nullable=True)
    is_published = Column(Boolean, default=True)
    is_protected = Column(Boolean, default=False)
    password_hash = Column(String(255), nullable=True)
    tags_text = Column(String(255), nullable=True)
    uploader_name = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    author = relationship("User")