from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth.dependencies import get_current_user
from ..auth.models import User
from .models import Project
from .schemas import ProjectCreate, ProjectOut
from typing import List

router = APIRouter(prefix="/api/v1/projects", tags=["Projects"])

@router.get("/", response_model=List[ProjectOut])
def list_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Project).order_by(Project.created_at.desc()).all()

@router.post("/", response_model=ProjectOut)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    obj = Project(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(project_id: int, payload: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    obj = db.query(Project).filter(Project.id == project_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Project not found")
    for k, v in payload.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

@router.post("/{project_id}/deliver")
def deliver_project(project_id: int, delivery_link: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    obj = db.query(Project).filter(Project.id == project_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Project not found")
    obj.delivery_link = delivery_link
    obj.status = "Delivered"
    obj.progress = 100
    db.commit()
    return {"message": "Delivered", "link": delivery_link}
