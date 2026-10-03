# Publish steps

## 1. Backend -> FastAPI Cloud
    cd backend
    pip install fastapi-cloud-cli
    fastapi login
    fastapi deploy                      # creates the app, may fail to boot until env vars exist - that's expected
    fastapi cloud env set ENVIRONMENT production
    fastapi cloud env set --secret SECRET_KEY "<48+ random chars>"
    fastapi cloud env set --secret ADMIN_API_KEY "<different 48+ random chars>"
    fastapi cloud env set --secret ADMIN_EMAIL "<your admin email>"
    fastapi cloud env set --secret ADMIN_PASSWORD "<strong first-run password>"
    fastapi cloud env set TRUST_PROXY true
    fastapi cloud env set ADMIN_URL http://localhost:5174
    fastapi cloud env set CORS_ORIGINS "http://localhost:5174"     # add the public site URL in step 3
    # DATABASE_URL: connect Neon/Supabase from the FastAPI Cloud dashboard (SQLite is not persistent)
    fastapi deploy

Generate random keys: `python -c "import secrets;print(secrets.token_urlsafe(48))"`

## 2. Public site -> Vercel / Netlify / Cloudflare Pages
Import this repo, root directory `frontend-public`, build `npm run build`, output `dist`,
env `VITE_API_URL=https://<your-app>.fastapicloud.dev`.

## 3. Close the loop
    fastapi cloud env set CORS_ORIGINS "https://<public-site-url>,http://localhost:5174"
    fastapi deploy
After the first admin login, delete ADMIN_PASSWORD: `fastapi cloud env delete ADMIN_PASSWORD`.
