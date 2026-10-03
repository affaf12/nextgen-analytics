from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from datetime import datetime
from ..database import Base

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    title = Column(String)
    description = Column(Text)
    stack = Column(String, default="FastAPI + React") # tech stack
    status = Column(String, default="Brief") # Brief, In Progress, Review, Delivered, Completed
    delivery_link = Column(String, nullable=True)
    github_repo = Column(String, nullable=True)
    deadline = Column(DateTime, nullable=True)
    progress = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
