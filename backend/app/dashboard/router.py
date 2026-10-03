from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from ..database import get_db
from ..auth.dependencies import get_current_user
from ..auth.models import User
from ..clients.models import Client
from ..orders.models import Order
from ..projects.models import Project
from ..erp.models import Invoice

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])

@router.get("/summary")
def summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    clients = db.query(Client).count()
    orders = db.query(Order).count()
    projects = db.query(Project).count()
    new_clients = db.query(Client).filter(Client.status == "New").count()
    in_progress = db.query(Project).filter(Project.status == "In Progress").count()
    delivered = db.query(Project).filter(Project.status == "Delivered").count()
    revenue = db.query(func.coalesce(func.sum(Invoice.amount), 0)).filter(Invoice.status == "Paid").scalar()
    return {
        "total_clients": clients,
        "new_leads": new_clients,
        "total_orders": orders,
        "active_projects": in_progress,
        "delivered_projects": delivered,
        "total_projects": projects,
        "total_revenue": revenue if (current_user.role or "").lower() == "admin" else None,
    }
