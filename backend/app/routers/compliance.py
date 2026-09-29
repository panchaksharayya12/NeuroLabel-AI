from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.models import ComplianceCheck, LabelingRequest
from ..schemas.schemas import ComplianceCheckOut, ComplianceSummary

router = APIRouter(prefix="/api/compliance", tags=["Compliance"])

@router.get("/{request_id}", response_model=ComplianceSummary)
def get_request_compliance(request_id: int, db: Session = Depends(get_db)):
    req = db.query(LabelingRequest).filter(LabelingRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    checks = db.query(ComplianceCheck).filter(ComplianceCheck.request_id == request_id).all()
    
    passed = sum(1 for c in checks if c.status == "PASS")
    warnings = sum(1 for c in checks if c.status == "WARNING")
    failed = sum(1 for c in checks if c.status == "FAIL")

    categories = {
        "Product Info": 100.0,
        "Regulatory": 90.0,
        "UDI": 95.0,
        "Safety Warnings": 85.0,
        "Symbols": 90.0,
        "Country Specific": 88.0
    }

    key_insights = [
        {"type": "error", "text": "1 warning symbol size issue detected (EU).", "severity": "High"},
        {"type": "info", "text": "2 translation terminology mismatches (DE).", "severity": "Medium"},
        {"type": "warning", "text": "1 minor compliance gap (India).", "severity": "Low"},
        {"type": "success", "text": "All other checks passed.", "severity": "Info"}
    ]

    return {
        "overall_score": req.compliance_score or 92.0,
        "categories": categories,
        "passed_count": passed,
        "warning_count": warnings,
        "failed_count": failed,
        "key_insights": key_insights,
        "checks": checks
    }
