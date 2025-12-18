from ultralytics import YOLO
from app.core.config import MODEL_PATH
from app.core.logger import logger

logger.info("Loading YOLO model...")
model = YOLO(str(MODEL_PATH))
logger.info("Model loaded successfully")