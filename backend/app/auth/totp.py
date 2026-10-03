"""RFC 6238 TOTP, no external dependency."""
import base64, hashlib, hmac, secrets, struct, time
from urllib.parse import quote


def new_secret() -> str:
    return base64.b32encode(secrets.token_bytes(20)).decode().rstrip("=")


def _code(secret: str, step: int) -> str:
    key = base64.b32decode(secret + "=" * (-len(secret) % 8))
    digest = hmac.new(key, struct.pack(">Q", step), hashlib.sha1).digest()
    o = digest[-1] & 0x0F
    n = (struct.unpack(">I", digest[o:o + 4])[0] & 0x7FFFFFFF) % 1_000_000
    return f"{n:06d}"


def verify(secret: str, code: str, last_step: int = 0, now: float = None):
    """Returns the matched 30-second step (store it as last_step) or None.
    Accepts +-1 step of clock drift; a step can only be used once."""
    code = (code or "").strip().replace(" ", "")
    if len(code) != 6 or not code.isdigit():
        return None
    cur = int((now or time.time()) // 30)
    for s in (cur - 1, cur, cur + 1):
        if s > (last_step or 0) and hmac.compare_digest(_code(secret, s), code):
            return s
    return None


def provisioning_uri(secret: str, email: str, issuer: str = "NextGen Agency OS") -> str:
    return f"otpauth://totp/{quote(issuer)}:{quote(email)}?secret={secret}&issuer={quote(issuer)}"
