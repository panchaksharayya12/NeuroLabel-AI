from fastapi import APIRouter
from pydantic import BaseModel
import os

router = APIRouter(prefix="/api/settings", tags=["Settings"])

class SystemSettings(BaseModel):
    ai_mode: str = "Fallback Local Deterministic Engine (Zero-Latency Offline Mode)"
    openai_configured: bool = False
    enable_eu_mdr: bool = True
    enable_cdsco: bool = True
    enable_fda_udi: bool = True
    enable_ukca: bool = False
    part11_electronic_signatures: bool = True
    confidence_threshold: float = 0.90
    ocr_engine: str = "OpenCV Computer Vision + Layout Differencer"

current_settings = SystemSettings(
    ai_mode="Fallback Local Deterministic Engine (Offline & Reliable)" if not os.getenv("OPENAI_API_KEY") else "OpenAI GPT-4o Hybrid",
    openai_configured=bool(os.getenv("OPENAI_API_KEY")),
    enable_eu_mdr=True,
    enable_cdsco=True,
    enable_fda_udi=True,
    enable_ukca=False,
    part11_electronic_signatures=True,
    confidence_threshold=0.90,
    ocr_engine="OpenCV Computer Vision + Layout Differencer"
)

@router.get("", response_model=SystemSettings)
def get_settings():
    return current_settings

@router.post("", response_model=SystemSettings)
def update_settings(settings: SystemSettings):
    global current_settings
    current_settings = settings
    return current_settings
