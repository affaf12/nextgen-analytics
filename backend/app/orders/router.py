from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth.dependencies import get_current_user
from ..auth.models import User
from .models import Order
from .schemas import OrderCreate, OrderOut
from typing import List

VALID_STATUSES = {"Pending", "Accepted", "In Progress", "Delivered", "Paid"}

router = APIRouter(prefix="/api/v1/orders", tags=["Orders"])

@router.get("/", response_model=List[OrderOut])
def list_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@router.post("/", response_model=OrderOut)
def create_order(payload: OrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Admin-only now. Public visitors use POST /api/v1/public/submit instead.
    obj = Order(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put("/{order_id}/status")
def update_status(order_id: int, status: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"status must be one of {sorted(VALID_STATUSES)}")
    obj = db.query(Order).filter(Order.id == order_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Order not found")
    obj.status = status
    db.commit()
    return {"ok": True, "status": status}
