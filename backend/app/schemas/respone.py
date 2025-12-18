from pydantic import BaseModel
from typing import List

class Detection(BaseModel):
    class_id: int
    confidence: float
    bbox: List[float]

class PredictResponse(BaseModel):
    success: bool
    detections: List[Detection]