# Deploy MathMentor: Render (API) + Vercel (frontend)

The API uses a **JSON file** for users, learners, and sessions (no MongoDB). Questions and content ship with the repo.

Do this **in order**: API first, then frontend, then add the frontend URL to Render.

---

## Part A — Backend on Render

1. Push this repo to **GitHub** (if it is not there yet).
2. [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**.
3. Connect the repo. Configure:
   - **Name:** e.g. `mathmentor-api`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free is fine to start

4. **Environment** → add variables:

   | Key | Value |
   |-----|--------|
   | `JWT_SECRET` | Long random string (32+ characters; keep secret) |
   | `JWT_EXPIRES_IN` | `30d` |
   | `NODE_ENV` | `production` |
   | `CLIENT_ORIGIN` | Optional: leave empty → API accepts any browser Origin (simplest for Vercel). Or set to your exact Vercel URL to restrict access. |

   **Do not** set `MONGO_URI` — it is not used.

5. **Optional — durable user data on Render**  
   On the **free** tier, the filesystem is **ephemeral**: user accounts and sessions can be **lost** after a redeploy or when the instance is replaced.  
   To keep `app-state.json` across deploys, add a **Persistent Disk** in the Render service, mount it (e.g. `/data`), and set:

   | Key | Example value |
   |-----|----------------|
   | `DATA_FILE_PATH` | `/data/app-state.json` |

   If you skip this, the app still works; data just may reset when Render recreates the instance.

6. **Create Web Service**. Wait until deploy is **Live**.
7. Copy the service URL, e.g. `https://mathmentor-api.onrender.com` (no trailing slash).

---

## Part B — Frontend on Vercel

1. [vercel.com](https://vercel.com) → **Add New…** → **Project** → import the **same** GitHub repo.
2. Configure:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)

3. **Environment Variables** — pick **one** approach:

   **A — Direct browser → Render (default)**  
   | Name | Value |
   |------|--------|
   | `VITE_API_URL` | `https://YOUR-RENDER-SERVICE.onrender.com` (same as Part A.7, **no** `/api` suffix) |

   **B — Same-origin proxy (if the live site cannot reach the API / CORS issues)**  
   Remove `VITE_API_URL` from Vercel. Add a **server-only** variable (not prefixed with `VITE_`):

   | Name | Value |
   |------|--------|
   | `RENDER_API_URL` | `https://YOUR-RENDER-SERVICE.onrender.com` (**no** `/api` suffix) |

   The browser calls `/api/...` on your Vercel domain; `client/api/[...slug].js` forwards those requests to Render.

4. **Deploy**. When it finishes, copy the production URL, e.g. `https://mathmentor.vercel.app`.

5. **Back on Render** (optional hardening) → **Environment** → you may set:

   - `CLIENT_ORIGIN` = your Vercel URL, e.g. `https://mathmentor.vercel.app`  
   - If you leave it empty, CORS still allows your Vercel app (reflect mode). Setting it restricts access to listed origins plus localhost.

6. **Manual Deploy** → **Clear build cache & deploy** (or save env so Render redeploys).

**`VITE_API_URL` on Vercel:** use `https://YOUR-SERVICE.onrender.com` only — **do not** add `/api` (the app adds it).

---

## Part C — Smoke test

1. Open `https://YOUR-API.onrender.com/api/health` — should return JSON with `status: OK` (first hit after idle may take 30–60s on free tier).
2. Open the **Vercel** URL → **Register** → **Login** → **Dashboard** → start a quiz.
3. If the browser shows **CORS** errors and you set **`CLIENT_ORIGIN`** on Render, it must **exactly** match the site URL (https, host, no trailing slash). If `CLIENT_ORIGIN` is empty, the API uses reflect mode and should allow Vercel; redeploy the API after pulling the latest server code.

---

## Free tier notes

- **Render** free web services **spin down** after ~15 minutes idle. The first request after sleep often takes **30–60+ seconds**.
- **Vercel** hobby tier is fine for the static Vite build.
- **No database seed step** — questions load from `server/data/questions.seed.js` and content from `server/data/content.seed.json` at runtime.

---

## Redeploying after code changes

1. **Push** to the branch Render/Vercel watch (usually `main`).
2. Both platforms auto-deploy, or trigger a deploy from each dashboard.
3. If you added env vars locally, mirror them in Render / Vercel project settings.
