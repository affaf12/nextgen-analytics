import secrets
from typing import Optional, List
from pydantic_settings import BaseSettings

_PLACEHOLDER_KEYS = {"", "nextgen-super-secret-key", "change-this-to-a-long-random-secret-in-production"}


class Settings(BaseSettings):
    # SECURE BY DEFAULT: anything other than the exact word "development" is
    # treated as production (strict startup checks + HSTS). Local dev sets
    # ENVIRONMENT=development in backend/.env.
    ENVIRONMENT: str = "production"

    # Swagger /docs and /openapi.json publish a map of every route.
    # Off unless you explicitly turn it on (local development only).
    ENABLE_DOCS: bool = False

    DATABASE_URL: str = "sqlite:///./agency.db"
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120

    # Comma-separated browser origins allowed to call the API, e.g.
    # https://nextgenanalytics.cloud-ip.cc,http://localhost:5174
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174"

    # Where the Admin Panel lives (used for password-reset links).
    # The admin panel is NOT public, so this is normally http://localhost:5174
    ADMIN_URL: str = "http://localhost:5174"

    # First-run admin account. Only used if the users table is empty.
    ADMIN_EMAIL: str = "admin@nextgenanalytics.cloud-ip.cc"
    ADMIN_PASSWORD: Optional[str] = None
    ADMIN_NAME: str = "Muhammad Affaf"

    # Shared secret the Admin Panel sends in an X-Admin-Key header. Without it
    # every non-public API route (login included) answers 404, so the admin API
    # is invisible to the internet even though the backend is public.
    # REQUIRED in production. The key lives only in your local admin .env.
    ADMIN_API_KEY: str = ""

    # Optional: restrict admin API routes to these IPs (comma-separated).
    # Leave blank to disable. Public routes are never affected.
    ADMIN_ALLOWED_IPS: str = ""
    # Set true only when running behind a proxy you control (Render, Nginx,
    # Cloudflare...) so X-Forwarded-For is trusted for client IP detection.
    TRUST_PROXY: bool = False

    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_NAME: str = "NextGen Agency OS"

    GITHUB_USERNAME: str = "affaf12"
    GITHUB_TOKEN: Optional[str] = None
    PORTFOLIO_EXCLUDE_REPOS: str = "affaf12.github.io,nextgen-agency-os"

    OPENAI_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        extra = "ignore"

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT.strip().lower() != "development"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip().rstrip("/") for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def admin_ips(self) -> List[str]:
        return [i.strip() for i in self.ADMIN_ALLOWED_IPS.split(",") if i.strip()]

    @property
    def db_url(self) -> str:
        """Normalise any Postgres URL (postgres://, postgresql://, +psycopg2, +psycopg)
        to the psycopg v3 driver, the only Postgres driver we ship."""
        url = self.DATABASE_URL.strip()
        for prefix in ("postgres://", "postgresql://", "postgresql+psycopg2://", "postgresql+psycopg://"):
            if url.startswith(prefix):
                return "postgresql+psycopg://" + url[len(prefix):]
        return url


settings = Settings()

if settings.is_production and len(settings.ADMIN_API_KEY) < 32:
    raise RuntimeError(
        "ADMIN_API_KEY missing/weak (32+ chars). Generate: "
        "python -c \"import secrets;print(secrets.token_urlsafe(48))\""
    )

if settings.SECRET_KEY in _PLACEHOLDER_KEYS or len(settings.SECRET_KEY) < 32:
    if settings.is_production:
        raise RuntimeError(
            "SECRET_KEY missing/weak (running in production mode; for local work set ENVIRONMENT=development). "
            "Set a random 48+ char value in the environment "
            "(python -c \"import secrets;print(secrets.token_urlsafe(48))\")."
        )
    # Dev only: random per-start key (admin sessions reset on restart)
    settings.SECRET_KEY = secrets.token_urlsafe(48)
    print("[DEV] SECRET_KEY not set - using a temporary random key for this run.")
