from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from ..database import Base

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    amount = Column(Integer)
    status = Column(String, default="Draft") # Draft, Sent, Paid, Overdue
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    amount = Column(Integer)
    category = Column(String) # Server, Tool, Marketing
    created_at = Column(DateTime, default=datetime.utcnow)
