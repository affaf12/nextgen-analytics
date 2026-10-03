from typing import List, Optional
from pydantic import BaseModel, Field


class AIEstimateRequest(BaseModel):
    client_problem: str = Field(min_length=3, max_length=2000)
    client_budget: Optional[str] = Field(default=None, max_length=40)


class AIEstimateResponse(BaseModel):
    suggested_stack: str
    estimated_hours: int
    suggested_price_usd: int
    breakdown: List[str]
    confidence: str


class AICRMRequest(BaseModel):
    client_name: str = Field(max_length=120)
    problem: str = Field(max_length=4000)
    history: Optional[str] = Field(default="", max_length=4000)


class AICRMResponse(BaseModel):
    summary: str
    next_action: str
    draft_message: str
    urgency: str


class AICodeRequest(BaseModel):
    project_title: str = Field(max_length=120)
    description: str = Field(max_length=2000)
    stack: str = Field(default="FastAPI + React", max_length=80)


class AICodeResponse(BaseModel):
    files: dict
    instructions: str


class AIChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)


class AIProposalRequest(BaseModel):
    client_name: str = Field(default="Client", max_length=120)
    problem: str = Field(default="", max_length=4000)
    price: int = Field(default=799, ge=0, le=1_000_000)
    stack: Optional[str] = Field(default="FastAPI + React", max_length=80)
