# GigFlow — production deployment

## URLs

- **Frontend (Vercel):** set your production domain (e.g. `https://gig-flow-smart-leads-dashboard-alpha.vercel.app`).
- **Backend (Render):** e.g. `https://<service>.onrender.com`.
- **MongoDB Atlas:** cluster connection string with user + IP allowlist (`0.0.0.0/0` for Render unless you lock IPs).

## Render (backend)

| Variable | Example |
|----------|---------|
| `PORT` | `5000` (Render sets automatically; keep default) |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://...` |
| `JWT_SECRET` | Long random string (32+ chars) |
| `JWT_EXPIRES_IN` | `7d` |
| `FRONTEND_URL` | Your Vercel URL, **no trailing slash**. Multiple origins: comma-separated (e.g. preview + prod). |
| `ALLOW_ADMIN_REGISTRATION` | `false` in production (recommended). |
| `GOOGLE_CLIENT_ID` | Same Web Client ID as Vercel `VITE_GOOGLE_CLIENT_ID`. |

**Health check path:** `/health` (not under `/api`).

## Vercel (frontend)

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://<your-service>.onrender.com/api` (**must** be absolute in production, not `/api`) |
| `VITE_GOOGLE_CLIENT_ID` | `xxxxx.apps.googleusercontent.com` |

**Root directory:** set to `frontend` in Vercel project settings **or** configure monorepo build to output `frontend/dist`.

**SPA refresh:** `frontend/vercel.json` rewrites all routes to `index.html`. Redeploy after adding it.

## Google Cloud (OAuth Web client)

**Authorized JavaScript origins** (exact, no trailing slash):

- `https://<your-vercel-host>.vercel.app`
- `http://localhost:5173` (local dev)

**Authorized redirect URIs:** leave empty for GIS popup + backend ID token verification (this app does not use server redirect OAuth).

## Smoke tests (production)

1. `GET https://<render>/health` → 200 JSON.
2. `OPTIONS https://<render>/api/auth/register` with `Origin: https://<vercel>` → 204 and `Access-Control-Allow-Origin` matches origin.
3. `POST .../api/auth/register` with JSON body (sales role) → 201.
4. Open Vercel site → Register → Dashboard loads; refresh `/dashboard` → no 404, session restored or login shown.

## Common failures

| Symptom | Fix |
|---------|-----|
| Vercel `POST /api/...` → **405** | `VITE_API_URL` not set to Render URL; redeploy. |
| Google **origin_mismatch** | Add exact Vercel origin in Google Console origins. |
| CORS blocked | `FRONTEND_URL` on Render must include that origin (comma-separated for multiple). |
| Admin signup **403** | Set `ALLOW_ADMIN_REGISTRATION=true` only if you need public admin signup. |
| Mongo timeout | Atlas Network Access allow Render; check URI user/password. |
