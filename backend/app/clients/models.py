from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from ..database import Base

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    source = Column(String, default="Website") # Website, LinkedIn, Referral
    status = Column(String, default="New") # New, Contacted, Qualified, Proposal, Won, Lost
    problem = Column(Text, nullable=True) # client ki problem jo wo bolta hai
    budget = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_contact = Column(DateTime, default=datetime.utcnow)
