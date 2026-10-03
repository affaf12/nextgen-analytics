from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProjectCreate(BaseModel):
    client_id: int
    title: str
    description: str
    stack: Optional[str] = "FastAPI + React"
    status: Optional[str] = "Brief"
    delivery_link: Optional[str] = None
    github_repo: Optional[str] = None
    progress: Optional[int] = 0

class ProjectOut(ProjectCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True
