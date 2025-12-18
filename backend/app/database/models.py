from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database.database import Base

class DetectionHistory(Base):
    __tablename__ = "detection_history"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, index=True)
    image_path = Column(String)
    label = Column(String)
    confidence = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)