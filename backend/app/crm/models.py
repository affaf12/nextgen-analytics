from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from datetime import datetime
from ..database import Base

class Interaction(Base):
    __tablename__ = "interactions"
    id = Column(Integer, primary_key=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    type = Column(String) # Call, WhatsApp, Email, Meeting, Note
    summary = Column(Text) # kya baat hui
    next_action = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
