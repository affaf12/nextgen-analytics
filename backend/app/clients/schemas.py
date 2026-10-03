from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ClientCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    source: Optional[str] = "Website"
    status: Optional[str] = "New"
    problem: Optional[str] = None
    budget: Optional[str] = None

class ClientOut(ClientCreate):
    id: int
    created_at: datetime
    last_contact: datetime
    class Config:
        from_attributes = True
