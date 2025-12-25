from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.database.database import engine
from app.database.models import Base
from app.api.predict import router as predict_router
from app.api.pages import router as pages_router
from app.api.results import router as results_router
from app.core.config import TEMP_DIR 

app = FastAPI(title="Traffic Sign Recognition")
Base.metadata.create_all(bind=engine)

app.mount(
    "/static",
    StaticFiles(directory="/frontend/static"),
    name="static"
)

app.mount(
    "/asset",
    StaticFiles(directory="/frontend/static"),
    name="asset"
)

app.mount(
    "/temp",
    StaticFiles(directory=TEMP_DIR),
    name="temp"
)

app.include_router(pages_router)

app.include_router(predict_router, prefix="/api")

app.include_router(results_router, prefix="/api")
