from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class InteractionCreate(BaseModel):
    client_id: int
    type: str
    summary: str
    next_action: Optional[str] = None

class InteractionOut(InteractionCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True
