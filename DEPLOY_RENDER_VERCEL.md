# Deploy MathMentor: Render (API) + Vercel (frontend)

Do this **in order**: API first, then frontend, then add the frontend URL to Render.

---

## Part A — MongoDB Atlas (already in use)

1. **Network Access** → allow `0.0.0.0/0` (or Render’s egress IPs if you prefer).
2. Copy your **`MONGO_URI`** (user must have read/write on the DB).

---

## Part B — Backend on Render

1. Push this repo to **GitHub**.
2. [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**.
3. Connect the repo. Configure:
   - **Name:** e.g. `mathmentor-api`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free (fine to start)

4. **Environment** → add variables:

   | Key | Value |
   |-----|--------|
   | `MONGO_URI` | Your Atlas connection string |
   | `JWT_SECRET` | Long random string (generate e.g. 32+ chars) |
   | `JWT_EXPIRES_IN` | `30d` |
   | `NODE_ENV` | `production` |
   | `CLIENT_ORIGIN` | Leave **empty** for now; you will set it after Vercel (step C.4). |

5. **Create Web Service**. Wait until deploy is **Live**.
6. Copy the service URL, e.g. `https://mathmentor-api.onrender.com` (no trailing slash).

---

## Part C — Frontend on Vercel

1. [vercel.com](https://vercel.com) → **Add New…** → **Project** → import the **same** GitHub repo.
2. Configure:
   - **Root Directory:** `client` (click Edit → set to `client`)
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default for Vite)

3. **Environment Variables** → add:

   | Name | Value |
   |------|--------|
   | `VITE_API_URL` | `https://YOUR-RENDER-SERVICE.onrender.com` (same as Part B.6, **no** `/api` suffix) |

4. **Deploy**. When it finishes, copy the production URL, e.g. `https://mathmentor.vercel.app`.

5. **Go back to Render** → your Web Service → **Environment** → set:

   - `CLIENT_ORIGIN` = your Vercel URL, e.g. `https://mathmentor.vercel.app`  
   - If you use a custom domain later, add it as a second value:  
     `https://mathmentor.vercel.app,https://www.yourdomain.com`

6. **Manual Deploy** → **Clear build cache & deploy** (or save env — Render redeploys) so CORS picks up the new origin.

---

## Part D — Smoke test

1. Open the **Vercel** URL → Register a new user.
2. Login → Dashboard → start a quiz.
3. If the browser console shows **CORS** errors, double-check:
   - `CLIENT_ORIGIN` on Render **exactly** matches the browser address (scheme + host, no trailing slash).
   - You redeployed the API after changing `CLIENT_ORIGIN`.

---

## Free tier notes

- **Render** free web services **spin down** after ~15 minutes idle. The first request after sleep can take **30–60+ seconds**.
- **Vercel** hobby tier is fine for this static + edge setup.

---

## Optional: seed production database

From your machine, with `MONGO_URI` in `server/.env` pointing at the **same** Atlas database Render uses:

```bash
cd server
node data/seed.js
```
