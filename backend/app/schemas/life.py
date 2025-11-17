from pydantic import BaseModel
from typing import Optional

class LifeCreate(BaseModel):
    title: str
    summary: Optional[str] = None
    is_published: bool = True

class LifeUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    is_published: Optional[bool] = None

class LifeOut(BaseModel):
    id: int
    title: str
    summary: Optional[str]
    is_published: bool

    class Config:
        from_attributes = True

class LifeContentUpload(BaseModel):
    content: str

class LifeContentResponse(BaseModel):
    content: str