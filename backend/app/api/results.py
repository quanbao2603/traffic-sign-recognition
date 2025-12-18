from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.service.history_service import get_history, delete_history
from app.api.deps import get_db

router = APIRouter(prefix="/results", tags=["Results"])

@router.get("/{type}")
def fetch_results(type: str, db: Session = Depends(get_db)):
    data = get_history(db, type)
    return [
        {
            "id": item.id,
            "image": item.image_path,
            "label": item.label,
            "confidence": item.confidence,
            "time": item.created_at
        }
        for item in data
    ]

@router.delete("/{type}")
def clear_results(type: str, db: Session = Depends(get_db)):
    delete_history(db, type)
    return {"success": True}