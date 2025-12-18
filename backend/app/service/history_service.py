from sqlalchemy.orm import Session
from app.database.models import DetectionHistory

def save_history(
    db: Session,
    type: str,
    image_path: str,
    label: str,
    confidence: float
):
    history = DetectionHistory(
        type=type,
        image_path=image_path,
        label=label,
        confidence=confidence
    )
    db.add(history)
    db.commit()
    db.refresh(history)
    return history

def get_history(db: Session, type: str):
    return (
        db.query(DetectionHistory)
        .filter(DetectionHistory.type == type)
        .order_by(DetectionHistory.created_at.desc())
        .all()
    )

def delete_history(db: Session, type: str):
    db.query(DetectionHistory)\
      .filter(DetectionHistory.type == type)\
      .delete()
    db.commit()