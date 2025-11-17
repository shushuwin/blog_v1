from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .utils.database import Base, engine, SessionLocal
from .models.user import User
from .models.category import Category
from .models.tag import Tag
from .models.post import Post
from .models.file import File
from .models.setting import Setting
from .api.auth import router as auth_router
from .api.posts import router as posts_router
from .api.files import router as files_router
from .api.settings import router as settings_router
from .api.categories import router as categories_router
from .api.projects import router as projects_router
from .api.life_posts import router as life_router
from .api.admin_settings import router as admin_settings_router
from .api.admin_users import router as admin_users_router
from .api.admin_publish import router as admin_publish_router
from .api.tags import router as tags_router
import bcrypt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.username == settings.admin_username).first()
        password_hash = bcrypt.hashpw(settings.admin_password.encode(), bcrypt.gensalt()).decode()
        if not admin:
            db.add(User(username=settings.admin_username, email=settings.admin_email, password_hash=password_hash))
            db.commit()
        else:
            admin.email = settings.admin_email
            admin.password_hash = password_hash
            db.commit()
        default_cats = [
            ("笔记分享", "notes", 1),
            ("实战项目", "projects", 2),
            ("个人生活", "life", 3)
        ]
        for name, slug, order in default_cats:
            if not db.query(Category).filter(Category.slug == slug).first():
                db.add(Category(name=name, slug=slug, sort_order=order))
        db.commit()

        # 兼容数据库列：为 posts 添加 uploader_name 列（若不存在）
        try:
            from sqlalchemy import text
            conn = engine.connect()
            # SQLite 列检测
            cols = conn.execute(text("PRAGMA table_info(posts)")).fetchall()
            names = [c[1] for c in cols]
            if 'uploader_name' not in names:
                conn.execute(text("ALTER TABLE posts ADD COLUMN uploader_name VARCHAR(100)"))
            # projects 列检测
            cols2 = conn.execute(text("PRAGMA table_info(projects)")).fetchall()
            names2 = [c[1] for c in cols2]
            if 'uploader_name' not in names2:
                conn.execute(text("ALTER TABLE projects ADD COLUMN uploader_name VARCHAR(100)"))
            if 'is_published' not in names2:
                conn.execute(text("ALTER TABLE projects ADD COLUMN is_published BOOLEAN DEFAULT 1"))
            if 'is_protected' not in names2:
                conn.execute(text("ALTER TABLE projects ADD COLUMN is_protected BOOLEAN DEFAULT 0"))
            if 'password_hash' not in names2:
                conn.execute(text("ALTER TABLE projects ADD COLUMN password_hash VARCHAR(255)"))
            if 'tags_text' not in names2:
                conn.execute(text("ALTER TABLE projects ADD COLUMN tags_text VARCHAR(255)"))
            conn.close()
        except Exception:
            pass
    finally:
        db.close()

app.include_router(auth_router, prefix="/api/auth")
app.include_router(posts_router, prefix="/api/posts")
app.include_router(projects_router, prefix="/api/projects")
app.include_router(life_router, prefix="/api/life-posts")
app.include_router(files_router, prefix="/api/files")
app.include_router(settings_router, prefix="/api/settings")
app.include_router(admin_settings_router, prefix="/api/admin/settings")
app.include_router(admin_users_router, prefix="/api/admin/users")
app.include_router(admin_publish_router, prefix="/api/admin/publish")
app.include_router(categories_router, prefix="/api/categories")
app.include_router(tags_router, prefix="/api/tags")

@app.get("/api/health")
def health():
    return {"status": "ok"}