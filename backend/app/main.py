import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from .database import engine, Base, SessionLocal
from .services.seed_data import seed_database
from .routers import (
    dashboard, requests, labels, products, compliance,
    artwork, translation, audit, search, notifications, settings
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed database with initial demo scenario
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="NeuroLabel AI API",
    description="Agentic AI-Powered Medical Device Labeling Automation",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static media files for label artwork and OpenCV diffs
media_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "media")
os.makedirs(media_dir, exist_ok=True)
app.mount("/media", StaticFiles(directory=media_dir), name="media")

# Include Routers
app.include_router(dashboard.router)
app.include_router(requests.router)
app.include_router(labels.router)
app.include_router(products.router)
app.include_router(compliance.router)
app.include_router(artwork.router)
app.include_router(translation.router)
app.include_router(audit.router)
app.include_router(search.router)
app.include_router(notifications.router)
app.include_router(settings.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "NeuroLabel AI Backend",
        "version": "1.0.0",
        "engine": "FastAPI + OpenCV + SQLite"
    }
