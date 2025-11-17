from pydantic import BaseModel
from typing import Optional

class PostCreate(BaseModel):
    title: str
    summary: Optional[str] = None
    category_id: Optional[int] = None
    is_published: bool = True
    is_protected: bool = False
    password: Optional[str] = None
    tags: Optional[list[str]] = None

class PostUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    category_id: Optional[int] = None
    is_published: Optional[bool] = None
    is_protected: Optional[bool] = None
    password: Optional[str] = None
    tags: Optional[list[str]] = None

class PostOut(BaseModel):
    id: int
    title: str
    summary: Optional[str]
    is_published: bool
    is_protected: bool

    class Config:
        from_attributes = True

class PostContentResponse(BaseModel):
    content: str

class PostAccessRequest(BaseModel):
    password: str

class PostAccessToken(BaseModel):
    post_access_token: str

class PostContentUpload(BaseModel):
    content: str