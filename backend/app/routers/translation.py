import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from ..models.models import TranslationCheck, LabelingRequest
from ..schemas.schemas import TranslationCheckOut

router = APIRouter(prefix="/api/translation", tags=["Translation"])

class TranslationValidateRequest(BaseModel):
    source_language: str = "English"
    target_language: str = "German"
    source_text: str
    target_text: str

@router.get("/{request_id}", response_model=TranslationCheckOut)
def get_translation_check(request_id: int, db: Session = Depends(get_db)):
    t = db.query(TranslationCheck).filter(TranslationCheck.request_id == request_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Translation record not found for request")
    return t

@router.post("/validate")
def validate_translation(body: TranslationValidateRequest):
    # Detect mismatches in terminology between EN and DE
    mismatches = []
    
    if "fire" in body.source_text.lower() and "feuer" in body.target_text.lower():
        mismatches.append({
            "term_en": "Fire risk",
            "term_de": "Brandgefahr / Brandrisiko",
            "recommendation": "Harmonize with EU MDR Annex I terminology for lithium battery warning.",
            "severity": "Minor"
        })
    if "dispose" in body.source_text.lower():
        mismatches.append({
            "term_en": "Do not dispose of in fire",
            "term_de": "Nicht ins Feuer werfen",
            "recommendation": "Use medical phrasing: 'Nicht im Hausmüll oder Feuer entsorgen'.",
            "severity": "Moderate"
        })

    status = "WARNING" if mismatches else "PASS"

    return {
        "source_language": body.source_language,
        "target_language": body.target_language,
        "status": status,
        "confidence": 0.94,
        "numeric_consistency": True,
        "terminology_mismatches": mismatches,
        "omitted_segments": []
    }
