import os
from ..core.config import settings
from .malware.scanner import MalwareScanner

class MalwareEngine:
    def __init__(self):
        # Prefer env SCANNER_MODEL_DIR, fallback to MALWARE_MODEL_DIR or upload_dir/models
        model_dir = os.getenv('SCANNER_MODEL_DIR') or os.getenv('MALWARE_MODEL_DIR') or os.path.join(settings.upload_dir, 'models')
        threshold = float(os.getenv('SCANNER_THRESHOLD', '0.5'))
        self.scanner = MalwareScanner(model_dir=model_dir, threshold=threshold)

    def predict(self, data: bytes):
        label, score = self.scanner.predict(data)
        return (label, score)

engine = MalwareEngine()