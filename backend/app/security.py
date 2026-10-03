"""Small, dependency-free security helpers: client IP, rate limiting."""
import time
from collections import defaultdict, deque
from threading import Lock
from fastapi import HTTPException, Request
from .config import settings


def client_ip(request: Request) -> str:
    if settings.TRUST_PROXY:
        fwd = request.headers.get("x-forwarded-for")
        if fwd:
            return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


class SlidingWindowLimiter:
    """In-memory limiter. Fine for a single instance; if you run several
    workers/instances, move this to Redis."""

    def __init__(self):
        self._hits = defaultdict(deque)
        self._lock = Lock()
        self._last_purge = time.time()

    def _purge(self, now: float):
        if now - self._last_purge < 300:
            return
        self._last_purge = now
        for k in [k for k, q in self._hits.items() if not q or now - q[-1] > 86400]:
            self._hits.pop(k, None)

    def count(self, key: str, window: int) -> int:
        now = time.time()
        with self._lock:
            q = self._hits[key]
            while q and now - q[0] > window:
                q.popleft()
            return len(q)

    def record(self, key: str):
        now = time.time()
        with self._lock:
            self._hits[key].append(now)
            self._purge(now)

    def reset(self):
        with self._lock:
            self._hits.clear()


limiter = SlidingWindowLimiter()


def rate_limit(name: str, limit: int, window_seconds: int):
    """FastAPI dependency: max `limit` calls per `window_seconds` per IP."""
    def dep(request: Request):
        key = f"{name}:{client_ip(request)}"
        if limiter.count(key, window_seconds) >= limit:
            raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
        limiter.record(key)
    return dep
