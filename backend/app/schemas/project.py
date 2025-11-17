from pydantic import BaseModel
from typing import Optional

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    demo_url: Optional[str] = None
    source_url: Optional[str] = None
    cover_image: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    demo_url: Optional[str] = None
    source_url: Optional[str] = None
    cover_image: Optional[str] = None

class ProjectOut(BaseModel):
    id: int
    name: str
    description: Optional[str]

    class Config:
        from_attributes = True

class ProjectContentUpload(BaseModel):
    content: str

class ProjectContentResponse(BaseModel):
    content: str