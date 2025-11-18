from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from ..utils.database import Base

class SignupAttempt(Base):
    __tablename__ = "signup_attempts"
    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String(64), index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)