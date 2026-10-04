from fastapi import APIRouter, Depends
from ..auth.dependencies import get_current_user
from ..auth.models import User
from ..config import settings
from ..security import rate_limit
from .models import (AIEstimateRequest, AIEstimateResponse, AICRMRequest, AICRMResponse,
                     AICodeRequest, AICodeResponse, AIChatRequest, AIProposalRequest)
from .services import mock_estimate, mock_crm_suggest, mock_code_gen, call_llm, parse_llm_estimate

router = APIRouter(prefix="/api/v1/ai", tags=["AI System"])

# PUBLIC (website visitors, rate-limited): /estimate and /chat only.
# Everything else below is an internal tool and needs an admin login.


@router.post("/estimate", response_model=AIEstimateResponse,
             dependencies=[Depends(rate_limit("ai-estimate", 10, 3600))])
async def ai_estimate(req: AIEstimateRequest):
    llm_text = await call_llm(
        f"Estimate project: {req.client_problem} budget {req.client_budget}. "
        f"Return ONLY valid JSON with keys: suggested_stack (string), estimated_hours (int), "
        f"suggested_price_usd (int), breakdown (list of strings), confidence (string)."
    )
    parsed = parse_llm_estimate(llm_text)
    if parsed:
        try:
            return AIEstimateResponse(**{k: parsed[k] for k in AIEstimateResponse.model_fields})
        except Exception:  # noqa: BLE001 - malformed LLM output -> fall back
            pass
    return mock_estimate(req.client_problem)


@router.post("/chat", dependencies=[Depends(rate_limit("ai-chat", 20, 3600))])
async def ai_chat(req: AIChatRequest):
    reply = await call_llm(f"Visitor asks: {req.message}")
    if not reply:
        reply = ("NextGen AI: Thanks for your question. For the exact scope and price, please use the \"Submit Your Problem\" "
                 "form - Affaf will reply personally within 2 hours.")
    return {"reply": reply, "is_ai": True}


# ---------------- admin-only tools ----------------

@router.post("/crm-suggest", response_model=AICRMResponse)
async def ai_crm_suggest(req: AICRMRequest, _: User = Depends(get_current_user)):
    result = mock_crm_suggest(req.client_name, req.problem, req.history)
    llm_text = await call_llm(f"Client {req.client_name} problem {req.problem} history {req.history}. "
                              "Suggest the next action and draft a short WhatsApp message in English")
    if llm_text:
        result["draft_message"] = llm_text[:300]
    return result


@router.post("/generate-code", response_model=AICodeResponse)
async def ai_generate_code(req: AICodeRequest, _: User = Depends(get_current_user)):
    return mock_code_gen(req.project_title, req.description, req.stack)


@router.post("/generate-proposal")
async def ai_proposal(data: AIProposalRequest, _: User = Depends(get_current_user)):
    proposal = f"""
Subject: Proposal for {data.problem[:40]} - NextGen AI Systems

Hi {data.client_name},

Thanks for sharing your problem: "{data.problem}"

**Our Solution:**
We will build a custom {data.stack} system that solves this in 2-3 days.

**Deliverables:**
- Full source code + deployment
- Admin dashboard + Client portal
- 1 month support

**Investment: ${data.price}**
**Timeline: 48-72 hours (first version)**

Best,
Muhammad Affaf
Founder, NextGen Analytics
nextgenanalytics.cloud-ip.cc
"""
    llm = await call_llm(f"Write pro agency proposal for client {data.client_name} problem {data.problem} "
                         f"price {data.price} stack {data.stack}")
    return {"proposal": llm or proposal}


@router.get("/status")
def ai_status(_: User = Depends(get_current_user)):
    has = bool(settings.OPENAI_API_KEY or settings.GROQ_API_KEY)
    return {"ai_enabled": True, "mode": "Real LLM" if has else "Smart Mock"}
