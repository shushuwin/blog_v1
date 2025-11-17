from sqlalchemy import Column, Integer, String, DateTime, Boolean, BigInteger
from datetime import datetime
from ..utils.database import Base

class File(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(100), nullable=True)
    file_size = Column(BigInteger, nullable=True)
    md5_hash = Column(String(32), nullable=True)
    is_safe = Column(Boolean, default=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)