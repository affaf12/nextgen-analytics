from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth.dependencies import require_admin
from ..auth.models import User
from .models import Invoice, Expense
from .schemas import InvoiceCreate, InvoiceOut, ExpenseCreate, ExpenseOut
from typing import List

router = APIRouter(prefix="/api/v1/erp", tags=["ERP"])

@router.get("/invoices", response_model=List[InvoiceOut])
def list_invoices(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return db.query(Invoice).order_by(Invoice.created_at.desc()).all()

@router.post("/invoices", response_model=InvoiceOut)
def create_invoice(payload: InvoiceCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    obj = Invoice(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.get("/expenses", response_model=List[ExpenseOut])
def list_expenses(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    return db.query(Expense).order_by(Expense.created_at.desc()).all()

@router.post("/expenses", response_model=ExpenseOut)
def create_expense(payload: ExpenseCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    obj = Expense(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.get("/stats")
def stats(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    total_rev = db.query(func.coalesce(func.sum(Invoice.amount), 0)).filter(Invoice.status == "Paid").scalar()
    pending = db.query(func.coalesce(func.sum(Invoice.amount), 0)).filter(Invoice.status != "Paid").scalar()
    total_exp = db.query(func.coalesce(func.sum(Expense.amount), 0)).scalar()
    return {
        "total_revenue": total_rev,
        "pending_amount": pending,
        "total_expenses": total_exp,
        "profit": total_rev - total_exp,
    }
