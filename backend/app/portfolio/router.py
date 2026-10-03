import time
import httpx
from fastapi import APIRouter
from ..config import settings

router = APIRouter(prefix="/api/v1/portfolio", tags=["Portfolio"])

# Simple in-process cache: GitHub's unauthenticated API allows only 60
# requests/hour per IP, which a live public site could burn through fast.
# Caching for a few minutes keeps it fast and safely under that limit,
# while still picking up a newly-pushed repo shortly after you add it.
_cache = {"data": None, "ts": 0}
CACHE_TTL_SECONDS = 600  # 10 minutes

# Keyword heuristics used to auto-sort each repo into a section, based on
# its name/description/language/topics on GitHub. No manual tagging needed
# - just write a normal description on GitHub and push.
AI_KEYWORDS = [
    "ai", "chatbot", "gpt", "llm", "machine learning", " ml ", "openai",
    "artificial intelligence", "nlp", "streamlit", "voice clon", "avatar",
    "sadtalker", "tts", "deep learning", "neural", "groq", "langchain",
]
POWERBI_KEYWORDS = [
    "power bi", "powerbi", "dax", "dashboard", "data analytics",
    "sales analysis", "hr analytics", "churn", "inventory management",
    "analytics dashboard", "power query", "kpi",
]


def _safe_link(homepage, fallback):
    h = (homepage or "").strip()
    return h if h.lower().startswith(("http://", "https://")) else fallback


def _format_title(repo_name: str) -> str:
    return repo_name.replace("-", " ").replace("_", " ").strip().title()


def _categorize(title: str, description: str, language: str, topics: list) -> str:
    text = " ".join([
        title or "", description or "", language or "", " ".join(topics or [])
    ]).lower()
    if any(k in text for k in AI_KEYWORDS):
        return "ai"
    if any(k in text for k in POWERBI_KEYWORDS):
        return "power_bi"
    return "other"


async def _fetch_from_github():
    excluded = {n.strip().lower() for n in settings.PORTFOLIO_EXCLUDE_REPOS.split(",") if n.strip()}
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "nextgen-agency-os"}
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(
            f"https://api.github.com/users/{settings.GITHUB_USERNAME}/repos",
            params={"sort": "updated", "per_page": 100},
            headers=headers,
        )
        resp.raise_for_status()
        repos = resp.json()

    sections = {"power_bi": [], "ai": [], "other": []}
    for r in repos:
        if r.get("fork"):
            continue
        if r.get("name", "").lower() in excluded:
            continue
        if not r.get("description"):
            # Repos with no description are treated as not-ready-to-show.
            # Add a short description on GitHub to make a repo appear here.
            continue

        title = _format_title(r["name"])
        description = r.get("description") or ""
        language = r.get("language") or ""
        topics = r.get("topics") or []
        category = _categorize(title, description, language, topics)

        sections[category].append({
            "title": title,
            "description": description,
            "tag": language or "Project",
            "link": _safe_link(r.get("homepage"), r["html_url"]),
            "repo_url": r["html_url"],
            "updated_at": r.get("updated_at"),
        })
    return sections


@router.get("/")
async def list_portfolio():
    now = time.time()
    if _cache["data"] is not None and (now - _cache["ts"]) < CACHE_TTL_SECONDS:
        return _cache["data"]

    try:
        sections = await _fetch_from_github()
        _cache["data"] = sections
        _cache["ts"] = now
        return sections
    except Exception:
        # GitHub down/rate-limited - serve last known good data rather than
        # breaking the public site, or empty sections if we have nothing yet.
        return _cache["data"] or {"power_bi": [], "ai": [], "other": []}
