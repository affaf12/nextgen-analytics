from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from datetime import datetime
from ..database import Base

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    title = Column(String) # order kya hai
    details = Column(Text)
    amount = Column(Integer)
    currency = Column(String, default="USD")
    status = Column(String, default="Pending") # Pending, Accepted, In Progress, Delivered, Paid
    created_at = Column(DateTime, default=datetime.utcnow)
