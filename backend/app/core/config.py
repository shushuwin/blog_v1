import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./blog.db")
    jwt_secret: str = os.getenv("JWT_SECRET", "change_me")
    jwt_algorithm: str = "HS256"
    jwt_expires: int = int(os.getenv("JWT_EXPIRES", "3600"))
    admin_username: str = os.getenv("ADMIN_USERNAME", "admin")
    admin_password: str = os.getenv("ADMIN_PASSWORD", "admin")
    admin_email: str = os.getenv("ADMIN_EMAIL", "admin@example.com")
    upload_dir: str = os.getenv("UPLOAD_DIR", "backend/app/static/uploads")
    model_path: str = os.getenv("MALWARE_MODEL_PATH", "")

settings = Settings()