import re
from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from ..clients.models import Client
from ..crm.models import Interaction
from ..database import get_db
from ..orders.models import Order
from ..security import rate_limit

router = APIRouter(prefix="/api/v1/public", tags=["Public"])


class PublicSubmission(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    company: Optional[str] = Field(default=None, max_length=120)
    phone: Optional[str] = Field(default=None, max_length=40)
    problem: str = Field(min_length=5, max_length=4000)
    budget: Optional[str] = Field(default=None, max_length=40)
    # "contact" = Contact Us form (no order), "portal" = Submit Your Problem (creates order)
    kind: str = Field(default="portal", pattern="^(portal|contact)$")
    # Honeypot: real users never see/fill this field, bots do.
    website: Optional[str] = Field(default=None, max_length=200)


@router.post("/submit", dependencies=[Depends(rate_limit("submit", 5, 3600))])
def submit(payload: PublicSubmission, db: Session = Depends(get_db)):
    if payload.website:  # bot - pretend success, store nothing
        return {"ok": True}

    is_portal = payload.kind == "portal"
    client = Client(
        name=payload.name.strip(), email=str(payload.email), phone=payload.phone,
        company=payload.company, problem=payload.problem, budget=payload.budget,
        status="New", source="Portal" if is_portal else "Contact Form",
    )
    db.add(client)
    db.flush()

    if is_portal:
        digits = re.sub(r"[^0-9]", "", payload.budget or "")[:7]
        db.add(Order(client_id=client.id, title=payload.problem[:50], details=payload.problem,
                     amount=int(digits) if digits else 0, currency="USD", status="Pending"))
    db.add(Interaction(
        client_id=client.id,
        type="Portal Submission" if is_portal else "Contact Form",
        summary=payload.problem,
        next_action="Call within 2 hours" if is_portal else "Reply to inquiry",
    ))
    db.commit()
    return {"ok": True}
