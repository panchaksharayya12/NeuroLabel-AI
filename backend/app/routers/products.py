from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.models import Product, RegulatoryChange
from ..schemas.schemas import ProductOut, RegulatoryChangeOut

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("", response_model=List[ProductOut])
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.get("/{id}", response_model=ProductOut)
def get_product(id: int, db: Session = Depends(get_db)):
    prod = db.query(Product).filter(Product.id == id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    return prod

@router.get("/regulations/all", response_model=List[RegulatoryChangeOut])
def list_regulations(db: Session = Depends(get_db)):
    return db.query(RegulatoryChange).all()
