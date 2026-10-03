import smtplib
import ssl
from email.mime.text import MIMEText
from ..config import settings


def send_reset_email(to_email: str, reset_link: str):
    """Sends the password-reset link by email via Gmail SMTP.
    If SMTP isn't configured (no SMTP_USER/SMTP_PASSWORD in .env), the link
    is printed to the backend console instead - so this works out of the
    box for local testing, and you can flip on real email later."""
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print("=" * 60)
        print(f"[DEV MODE - no SMTP configured] Password reset link for {to_email}:")
        print(reset_link)
        print("=" * 60)
        return

    subject = "Reset your NextGen Agency OS password"
    body = f"""Hi,

We received a request to reset your password.

Click the link below to set a new one (valid for 30 minutes):
{reset_link}

If you didn't request this, you can ignore this email - your password won't change.

- {settings.SMTP_FROM_NAME}
"""
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_USER}>"
    msg["To"] = to_email

    context = ssl.create_default_context()
    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls(context=context)
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_USER, [to_email], msg.as_string())
    except Exception as e:
        # Don't crash the request over an email delivery failure - log it
        # and also print the link so it isn't lost.
        print(f"[EMAIL ERROR] Could not send reset email to {to_email}: {e}")
        print(f"Reset link (send manually if needed): {reset_link}")
