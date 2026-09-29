from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models.models import Label, LabelVersion, Product
from ..schemas.schemas import LabelOut, LabelCreate, LabelVersionOut

router = APIRouter(prefix="/api/labels", tags=["Labels Library"])

@router.get("", response_model=List[LabelOut])
def list_labels(
    product_id: Optional[int] = None,
    market: Optional[str] = None,
    language: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Label)
    if product_id:
        query = query.filter(Label.product_id == product_id)
    if market:
        query = query.filter(Label.market.ilike(f"%{market}%"))
    if language:
        query = query.filter(Label.language == language)
    if status:
        query = query.filter(Label.status == status)
    return query.order_by(Label.id.asc()).all()

@router.post("", response_model=LabelOut)
def create_label(data: LabelCreate, db: Session = Depends(get_db)):
    existing = db.query(Label).filter(Label.label_code == data.label_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Label code already exists")

    new_label = Label(
        product_id=data.product_id,
        label_code=data.label_code,
        name=data.name,
        market=data.market,
        language=data.language,
        label_type=data.label_type,
        current_version_str="v1.0",
        status="Active",
        compliance_status="Compliant",
        preview_image="/media/req_1_orig.png"
    )
    db.add(new_label)
    db.commit()
    db.refresh(new_label)

    # Create initial version v1.0
    v1 = LabelVersion(
        label_id=new_label.id,
        version_number="v1.0",
        title="Initial Draft Release",
        content_text=data.content_text,
        safety_warning=data.safety_warning,
        dimensions="100mm x 60mm",
        status="Approved"
    )
    db.add(v1)
    db.commit()

    return new_label

@router.get("/{id}", response_model=LabelOut)
def get_label(id: int, db: Session = Depends(get_db)):
    lbl = db.query(Label).filter(Label.id == id).first()
    if not lbl:
        raise HTTPException(status_code=404, detail="Label not found")
    return lbl

@router.get("/{id}/versions", response_model=List[LabelVersionOut])
def get_label_versions(id: int, db: Session = Depends(get_db)):
    return db.query(LabelVersion).filter(LabelVersion.label_id == id).order_by(LabelVersion.id.desc()).all()
