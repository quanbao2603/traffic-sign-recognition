import uuid
from pathlib import Path

from app.models.model_loader import model
from app.core.classes import CLASS_NAMES
from app.core.config import TEMP_DIR
from app.core.logger import logger


def predict_image(file):
    filename = f"{uuid.uuid4().hex}.jpg"
    image_path: Path = TEMP_DIR / filename

    with open(image_path, "wb") as f:
        f.write(file.file.read())

    logger.info(f"Saved image to {image_path}")

    results = model(str(image_path))

    detections = []

    for r in results:
        if r.boxes is None:
            continue

        for box in r.boxes:
            class_id = int(box.cls.item())
            confidence = float(box.conf.item())

            detections.append({
                "class_id": class_id,
                "label": CLASS_NAMES.get(class_id, "Unknown"),
                "confidence": confidence,
                "bbox": box.xyxy[0].tolist(),
                "image_path": f"/temp/{filename}"
            })

    logger.info(f"Detected {len(detections)} object(s)")
    return detections