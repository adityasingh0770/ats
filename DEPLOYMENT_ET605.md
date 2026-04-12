# ET605 Deployment Guide — Grade 8 Mensuration (MathMentor)

Container: `grade8-mensuration`  
Linux user: `grade8_mensuration`  
App port: `3016` (bound to `0.0.0.0`)  
Public URL: `https://grade8-mensuration.kaushik-dev.online`

---

## Prerequisites

| Machine | Requirement |
|---------|-------------|
| Windows (local) | Node 18+, npm, `cloudflared` installed (Cloudflare MSI) |
| Ubuntu container | Node 18+, npm, `pm2` installed globally (`npm i -g pm2`) |

---

## 1. Local: Build the client

```bash
cd client
npm install
npm run build          # produces client/dist/
cd ..
```

Verify `client/dist/index.html` exists.

---

## 2. Local: SSH into the container

```bash
ssh \
  -o ProxyCommand="cloudflared access ssh --hostname ssh-g8-mensuration.kaushik-dev.online" \
  -i <PATH_TO_YOUR_LOCAL_PEM_FILE> \
  grade8_mensuration@ssh-g8-mensuration.kaushik-dev.online
```

> Replace `<PATH_TO_YOUR_LOCAL_PEM_FILE>` with the actual path to your `.pem` key.  
> **Never commit or share the `.pem` file.**

---

## 3. Container: Upload the project

From your **local** machine, use `scp` (or rsync) through the Cloudflare tunnel:

```bash
# One-liner using scp + ProxyCommand (run from the repo root)
scp -r \
  -o ProxyCommand="cloudflared access ssh --hostname ssh-g8-mensuration.kaushik-dev.online" \
  -i <PATH_TO_YOUR_LOCAL_PEM_FILE> \
  server client/dist package*.json DEPLOYMENT_ET605.md \
  grade8_mensuration@ssh-g8-mensuration.kaushik-dev.online:~/app/
```

Or zip, upload, and unzip on the container — whichever is easier.

---

## 4. Container: Install dependencies and configure .env

```bash
cd ~/app/server
npm install --omit=dev

# Create .env (copy example and edit)
cp .env.example .env
```

Edit `~/app/server/.env`:

```
PORT=3016
JWT_SECRET=<generate-a-strong-random-string>
JWT_EXPIRES_IN=30d
NODE_ENV=production
```

> Generate a secret: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

---

## 5. Container: Start with pm2

```bash
cd ~/app/server

# Start the process
pm2 start index.js --name mathmentor

# Persist across reboots
pm2 save
pm2 startup
# ^^^ pm2 prints a sudo command — copy-paste and run it
```

---

## 6. Verify deployment

### Health check (from the container)

```bash
curl http://localhost:3016/api/health
# Expected: {"status":"OK","message":"MathMentor API running"}
```

### SPA check

```bash
curl -s http://localhost:3016/ | head -5
# Should show HTML from client/dist/index.html
```

### From your browser

Open `https://grade8-mensuration.kaushik-dev.online/api/health`

Open `https://grade8-mensuration.kaushik-dev.online/mensuration-grade-8` for the landing page.

### Merge portal entry test

Open:
```
https://grade8-mensuration.kaushik-dev.online/chapter?token=test&student_id=1&session_id=abc
```
Should auto-login and redirect to the topics page.

---

## 7. Updating after code changes

```bash
# On the container:
cd ~/app/server
pm2 stop mathmentor

# Upload new files (server/ and client/dist/) from local ...

npm install --omit=dev
pm2 start mathmentor
```

---

## pm2 cheat-sheet

| Command | Purpose |
|---------|---------|
| `pm2 list` | Show running processes |
| `pm2 logs mathmentor` | Tail logs |
| `pm2 restart mathmentor` | Restart the app |
| `pm2 stop mathmentor` | Stop without removing |
| `pm2 delete mathmentor` | Remove from pm2 |

---

## File layout on the container

```
~/app/
  server/           # Express API + entry point
    index.js
    .env             # secrets — NOT committed
    data/
      app-state.json # user/session data (auto-created)
  client/
    dist/            # Vite production build (served by Express)
```

---

## Security notes

- `.pem` keys, `.env` files, and JWTs must **never** be committed to git.
- The `.gitignore` already excludes `*.pem`, `*.key`, and `.env` files.
- The Merge portal token is stored in `sessionStorage` (cleared when the tab closes).
- The Recommendation API call is proxied through our server (`POST /api/merge/recommend`)
  so the Merge token is never exposed to CORS or browser limitations.
