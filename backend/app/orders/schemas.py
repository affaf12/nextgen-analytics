from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class OrderCreate(BaseModel):
    client_id: int
    title: str
    details: str
    amount: int
    currency: Optional[str] = "USD"
    status: Optional[str] = "Pending"

class OrderOut(OrderCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True
