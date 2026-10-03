from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth.dependencies import get_current_user
from ..auth.models import User
from .models import Client
from .schemas import ClientCreate, ClientOut
from typing import List
from datetime import datetime

router = APIRouter(prefix="/api/v1/clients", tags=["Clients"])

@router.get("/", response_model=List[ClientOut])
def list_clients(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Client).order_by(Client.created_at.desc()).all()

@router.get("/{client_id}", response_model=ClientOut)
def get_client(client_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    obj = db.query(Client).filter(Client.id == client_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Client not found")
    return obj

@router.post("/", response_model=ClientOut)
def create_client(payload: ClientCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Admin-only now. Public visitors use POST /api/v1/public/submit instead.
    obj = Client(**payload.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put("/{client_id}", response_model=ClientOut)
def update_client(client_id: int, payload: ClientCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    obj = db.query(Client).filter(Client.id == client_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Client not found")
    for k, v in payload.model_dump().items():
        setattr(obj, k, v)
    obj.last_contact = datetime.utcnow()
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    obj = db.query(Client).filter(Client.id == client_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(obj)
    db.commit()
    return {"ok": True}
