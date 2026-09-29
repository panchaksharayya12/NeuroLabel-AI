from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.models import Product, Label, RegulatoryChange, LabelingRequest
from ..schemas.schemas import SearchResultItem

router = APIRouter(prefix="/api/search", tags=["Global Search"])

@router.get("", response_model=List[SearchResultItem])
def search_all(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    results: List[SearchResultItem] = []
    term = f"%{q.strip()}%"

    # Search Products
    products = db.query(Product).filter(
        (Product.name.ilike(term)) | (Product.model.ilike(term)) | (Product.sku.ilike(term))
    ).limit(5).all()
    for p in products:
        results.append(SearchResultItem(
            type="product",
            title=f"{p.name} ({p.model})",
            subtitle=f"SKU: {p.sku} • {p.device_class} • Markets: {p.markets}",
            url="/labels",
            id=p.id
        ))

    # Search Labels
    labels = db.query(Label).filter(
        (Label.name.ilike(term)) | (Label.label_code.ilike(term)) | (Label.market.ilike(term))
    ).limit(5).all()
    for l in labels:
        results.append(SearchResultItem(
            type="label",
            title=f"{l.name} ({l.label_code})",
            subtitle=f"{l.market} • {l.language} • {l.status} • {l.current_version_str}",
            url="/labels",
            id=l.id
        ))

    # Search Regulatory Changes
    regs = db.query(RegulatoryChange).filter(
        (RegulatoryChange.title.ilike(term)) | (RegulatoryChange.authority.ilike(term)) | (RegulatoryChange.change_id.ilike(term))
    ).limit(5).all()
    for r in regs:
        results.append(SearchResultItem(
            type="regulation",
            title=f"{r.title} [{r.change_id}]",
            subtitle=f"{r.authority} • {r.jurisdiction} • Severity: {r.severity}",
            url="/compliance",
            id=r.id
        ))

    # Search Labeling Requests
    reqs = db.query(LabelingRequest).filter(
        (LabelingRequest.request_number.ilike(term)) | (LabelingRequest.title.ilike(term))
    ).limit(5).all()
    for rq in reqs:
        results.append(SearchResultItem(
            type="request",
            title=f"{rq.request_number} - {rq.title}",
            subtitle=f"Status: {rq.status} • Markets: {rq.markets}",
            url=f"/requests/{rq.id}",
            id=rq.id
        ))

    return results
