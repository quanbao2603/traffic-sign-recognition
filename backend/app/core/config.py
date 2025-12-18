from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "training_recognition_final.pt"
TEMP_DIR = BASE_DIR.parent / "temp"
TEMP_DIR.mkdir(exist_ok=True)
