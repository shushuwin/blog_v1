from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from ..utils.database import Base

class PostTag(Base):
    __tablename__ = 'post_tags'
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    tag_id = Column(Integer, ForeignKey('tags.id', ondelete='CASCADE'), nullable=False)
    __table_args__ = (UniqueConstraint('post_id', 'tag_id', name='uq_post_tag'),)