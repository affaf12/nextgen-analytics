from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth.dependencies import get_current_user
from ..auth.models import User
from .models import Interaction
from .schemas import InteractionCreate, InteractionOut
from typing import List

router = APIRouter(prefix="/api/v1/crm", tags=["CRM"])

@router.get("/interactions/{client_id}", response_model=List[InteractionOut])
def get_interactions(client_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Interaction).filter(Interaction.client_id == client_id).order_by(Interaction.created_at.desc()).all()

@router.post("/interactions", response_model=InteractionOut)
def add_interaction(payload: InteractionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Admin-only now. Public visitors use POST /api/v1/public/submit instead.
    obj = Interaction(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.get("/timeline")
def timeline(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # sab clients ki timeline - kab aya, kya hua
    all_inter = db.query(Interaction).order_by(Interaction.created_at.desc()).limit(100).all()
    return all_inter
