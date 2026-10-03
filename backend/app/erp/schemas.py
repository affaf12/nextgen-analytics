from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class InvoiceCreate(BaseModel):
    client_id: int
    order_id: Optional[int] = None
    amount: int
    status: Optional[str] = "Draft"
    due_date: Optional[datetime] = None

class InvoiceOut(InvoiceCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ExpenseCreate(BaseModel):
    title: str
    amount: int
    category: str

class ExpenseOut(ExpenseCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True
