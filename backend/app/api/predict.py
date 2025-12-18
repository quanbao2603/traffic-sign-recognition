from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from app.service.inference_service import predict_image
from app.service.history_service import save_history
from app.api.deps import get_db

router = APIRouter(tags=["Prediction"])

@router.post("/predict/image")
async def predict_image_api(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    detections = predict_image(file)

    best_detection = None

    if detections:
        best_detection = max(detections, key=lambda x: x["confidence"])

        save_history(
            db=db,
            type="image",
            image_path=best_detection["image_path"],
            label=best_detection["label"],
            confidence=best_detection["confidence"]
        )

    return {
        "success": True,
        "best": best_detection,
        "detections": detections
    }