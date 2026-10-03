import hmac
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import settings
from .database import Base, SessionLocal, engine, run_light_migrations
from .auth.models import User, AuditLog
from .clients.models import Client
from .crm.models import Interaction
from .projects.models import Project
from .orders.models import Order
from .erp.models import Invoice, Expense
from .security import client_ip

from .auth.router import router as auth_router
from .clients.router import router as clients_router
from .crm.router import router as crm_router
from .projects.router import router as projects_router
from .orders.router import router as orders_router
from .erp.router import router as erp_router
from .dashboard.router import router as dashboard_router
from .ai.router import router as ai_router
from .portfolio.router import router as portfolio_router
from .public.router import router as public_router
from .bootstrap import bootstrap_admin

logging.basicConfig(level=logging.INFO)

Base.metadata.create_all(bind=engine)
run_light_migrations()
with SessionLocal() as _db:
    bootstrap_admin(_db)

app = FastAPI(
    title="NextGen Agency OS",
    version="3.0.0",
    # /docs and /openapi.json would publish a map of every admin route -> off by default
    docs_url="/docs" if settings.ENABLE_DOCS else None,
    redoc_url=None,
    openapi_url="/openapi.json" if settings.ENABLE_DOCS else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Admin-Key"],
    max_age=600,
)

# Routes any visitor may reach. Everything else under /api/ is "admin surface".
PUBLIC_PREFIXES = ("/api/v1/public/", "/api/v1/portfolio", "/api/v1/ai/estimate", "/api/v1/ai/chat")


@app.middleware("http")
async def hardening(request: Request, call_next):
    path = request.url.path
    is_admin_surface = path.startswith("/api/") and request.method != "OPTIONS" \
        and not path.startswith(PUBLIC_PREFIXES)
    if is_admin_surface:
        # Layer 1: shared admin key (only your admin panel has it)
        if settings.ADMIN_API_KEY and not hmac.compare_digest(
                request.headers.get("x-admin-key", "").encode(), settings.ADMIN_API_KEY.encode()):
            return JSONResponse({"detail": "Not found"}, status_code=404)
        # Layer 2 (optional): IP allow-list
        if settings.admin_ips and client_ip(request) not in settings.admin_ips:
            return JSONResponse({"detail": "Not found"}, status_code=404)

    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    if path.startswith("/api/v1/") and not path.startswith("/api/v1/portfolio"):
        response.headers["Cache-Control"] = "no-store"
    if settings.is_production:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


for r in (public_router, auth_router, clients_router, crm_router, projects_router,
          orders_router, erp_router, dashboard_router, ai_router, portfolio_router):
    app.include_router(r)


@app.get("/")
def root():
    return {"service": "NextGen Agency OS API", "status": "ok"}


@app.get("/health")
def health():
    return {"status": "ok"}
