from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from pathlib import Path

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parents[3]

FRONTEND_DIR = BASE_DIR / "frontend"

templates = Jinja2Templates(directory=FRONTEND_DIR / "templates")

@router.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "page": "home"}
    )

@router.get("/image")
def image_detection(request: Request):
    return templates.TemplateResponse(
        "image-detection/image-detection.html",
        {"request": request, "page": "image"}
    )

@router.get("/camera")
def camera_detection(request: Request):
    return templates.TemplateResponse(
        "camera-detection/camera-detection.html",
        {"request": request, "page": "camera"}
    )

@router.get("/results")
def camera_detection(request: Request):
    return templates.TemplateResponse(
        "results/results.html",
        {"request": request, "page": "results"}
    )