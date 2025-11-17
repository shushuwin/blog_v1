import hashlib
import os
from ..core.config import settings

IMAGE_TYPES = {"image/png", "image/jpeg", "image/gif", "image/webp"}

def _safe_filename(original: str):
    base = os.path.basename(original)
    return base.replace(" ", "_")

def save_upload(file, subdir: str):
    root = settings.upload_dir
    target_dir = os.path.join(root, subdir)
    os.makedirs(target_dir, exist_ok=True)
    name = os.urandom(8).hex() + "_" + _safe_filename(file.filename)
    path = os.path.join(target_dir, name)
    data = file.file.read()
    if len(data) > 10 * 1024 * 1024:
        raise ValueError("file too large")
    with open(path, "wb") as f:
        f.write(data)
    md5 = hashlib.md5(data).hexdigest()
    return path, md5

def save_markdown_upload(file):
    if not (file.filename.lower().endswith('.md') or file.content_type in {'text/markdown', 'text/plain'}):
        raise ValueError("invalid markdown file")
    return save_upload(file, 'markdown')

def save_image_upload(file):
    if file.content_type not in IMAGE_TYPES:
        raise ValueError("invalid image type")
    return save_upload(file, 'images')