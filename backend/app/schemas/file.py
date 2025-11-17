from pydantic import BaseModel
from typing import Literal

class ScanResult(BaseModel):
    label: Literal['malicious', 'benign']
    confidence: float