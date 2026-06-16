# Space News Hub — Deployment Guide

This guide walks through deploying the **Space News Hub** full-stack application:

| Layer    | Stack              | Host           |
| -------- | ------------------ | -------------- |
| Frontend | React + Vite       | Vercel         |
| Backend  | Node.js + Express  | Render         |
| Database | MongoDB            | MongoDB Atlas  |

---

## Architecture Overview

```
Browser (Vercel)
    │
    │  HTTPS  →  VITE_API_URL
    ▼
Render (Express API)
    │
    ├── MongoDB Atlas  (MONGODB_URI)
    └── Spaceflight News API  (external, no key required)
```

---

## 1. MongoDB Atlas Setup

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a **new cluster** (M0 Free tier is sufficient).
3. Under **Database Access**, create a database user with a username and password. Save these credentials.
4. Under **Network Access**, add an IP address:
   - For development: add your current IP.
   - For production: click **Allow Access from Anywhere** (`0.0.0.0/0`) so Render can connect.
5. Click **Connect** on your cluster → **Drivers** → copy the connection string.
6. Replace `<password>` with your database user password and `<dbname>` with your database name (e.g. `space-news-hub`).

**Example connection string:**

```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/space-news-hub?retryWrites=true&w=majority
```

This value becomes `MONGODB_URI` on Render.

---

## 2. Backend Deployment (Render)

### Prerequisites

- GitHub repository with this project pushed
- MongoDB Atlas connection string (from step 1)

### Create the Web Service

1. Go to [https://dashboard.render.com](https://dashboard.render.com) and sign in.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:

| Setting            | Value                          |
| ------------------ | ------------------------------ |
| **Name**           | `space-news-hub-api` (or any name) |
| **Region**         | Choose closest to your users   |
| **Branch**         | `main`                         |
| **Root Directory** | `backend`                      |
| **Runtime**        | Node                           |
| **Build Command**  | `npm install`                  |
| **Start Command**  | `npm start`                    |
| **Instance Type**  | Free (or paid for always-on)   |

### Environment Variables (Render Dashboard)

In your Render service → **Environment** → add these variables:

| Key             | Value                                                                 | Required |
| --------------- | --------------------------------------------------------------------- | -------- |
| `NODE_ENV`      | `production`                                                          | Yes      |
| `PORT`          | `10000` (Render sets this automatically; you can omit it)             | No       |
| `MONGODB_URI`   | `mongodb+srv://user:pass@cluster.mongodb.net/space-news-hub?...`      | Yes      |
| `JWT_SECRET`    | A long random string (e.g. generate with `openssl rand -base64 32`)   | Yes      |
| `JWT_EXPIRES_IN`| `7d`                                                                  | No       |
| `FRONTEND_URL`  | `https://your-app.vercel.app` (your Vercel URL — set after step 3)    | Yes      |

**Important:** `FRONTEND_URL` must exactly match your Vercel deployment URL (no trailing slash). If you use a custom domain, use that URL instead.

**Example Render environment block:**

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/space-news-hub?retryWrites=true&w=majority
JWT_SECRET=a8f3k9d2m7x1p5q0w4e6r8t0y2u4i6o8
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://space-news-hub.vercel.app
```

### Verify Backend

After deploy, open your Render URL (e.g. `https://space-news-hub-api.onrender.com`).

You should see:

```json
{
  "success": true,
  "message": "Space News Hub API is running"
}
```

Test the news endpoint:

```
https://space-news-hub-api.onrender.com/api/news
```

Save your Render backend URL — you need it for the frontend.

---

## 3. Frontend Deployment (Vercel)

### Prerequisites

- GitHub repository connected to Vercel
- Render backend deployed and URL known

### Create the Project

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard) and sign in.
2. Click **Add New** → **Project**.
3. Import your GitHub repository.
4. Configure the project:

| Setting              | Value        |
| -------------------- | ------------ |
| **Framework Preset** | Vite         |
| **Root Directory**   | `frontend`   |
| **Build Command**    | `npm run build` |
| **Output Directory** | `dist`       |

### Environment Variables (Vercel Dashboard)

In your Vercel project → **Settings** → **Environment Variables**:

| Key             | Value                                              | Environment |
| --------------- | -------------------------------------------------- | ----------- |
| `VITE_API_URL`  | `https://space-news-hub-api.onrender.com/api`      | Production  |

Replace the URL with your actual Render backend URL. The value **must** include `/api` at the end.

**Example Vercel environment block (Production):**

```
VITE_API_URL=https://space-news-hub-api.onrender.com/api
```

For local development, values are loaded from `frontend/.env.development` automatically — no Vercel setup needed.

### React Router (SPA) on Vercel

The project includes `frontend/vercel.json`, which rewrites all routes to `index.html`. This ensures client-side routes like `/login`, `/register`, and `/bookmarks` work when refreshed or accessed directly.

No additional Vercel configuration is required.

### Deploy and Verify

1. Click **Deploy**.
2. After deployment, copy your Vercel URL (e.g. `https://space-news-hub.vercel.app`).
3. Go back to **Render** and update `FRONTEND_URL` to your Vercel URL.
4. Redeploy or restart the Render service so CORS picks up the new origin.

---

## 4. Complete Environment Variable Reference

### Backend (`backend/.env` — local | Render dashboard — production)

| Variable         | Description                                      | Example (local)                    | Example (production)                          |
| ---------------- | ------------------------------------------------ | ---------------------------------- | --------------------------------------------- |
| `PORT`           | Server port (Render sets automatically)          | `5000`                             | *(set by Render)*                             |
| `NODE_ENV`       | Runtime environment                              | `development`                      | `production`                                  |
| `MONGODB_URI`    | MongoDB Atlas connection string                  | `mongodb+srv://...`                | `mongodb+srv://...`                           |
| `JWT_SECRET`     | Secret key for signing JWTs                      | `dev_secret_change_me`             | Long random string                            |
| `JWT_EXPIRES_IN` | Token expiry duration                            | `7d`                               | `7d`                                          |
| `FRONTEND_URL`   | Allowed CORS origin(s), comma-separated          | `http://localhost:5173`            | `https://your-app.vercel.app`                 |

Copy `backend/.env.example` to `backend/.env` for local development:

```bash
cd backend
cp .env.example .env
# Edit .env with your local values
```

### Frontend (`frontend/.env.development` | `.env.production` | Vercel dashboard)

| Variable         | Description                    | Example (development)              | Example (production)                              |
| ---------------- | ------------------------------ | ---------------------------------- | ------------------------------------------------- |
| `VITE_API_URL`   | Backend API base URL           | `http://localhost:5000/api`        | `https://space-news-hub-api.onrender.com/api`     |

---

## 5. Local Development

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

Server runs on the port defined in `PORT` (default `5000`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite loads `frontend/.env.development` automatically. The app connects to `http://localhost:5000/api`.

---

## 6. Deployment Checklist

### MongoDB Atlas
- [ ] Cluster created
- [ ] Database user created
- [ ] Network access allows Render (`0.0.0.0/0` or Render IPs)
- [ ] Connection string copied

### Render (Backend)
- [ ] Root directory set to `backend`
- [ ] Start command: `npm start`
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` set
- [ ] `JWT_SECRET` set (strong random value)
- [ ] `FRONTEND_URL` set to Vercel URL
- [ ] Health check returns success JSON
- [ ] `/api/news` returns articles

### Vercel (Frontend)
- [ ] Root directory set to `frontend`
- [ ] `VITE_API_URL` set to Render URL + `/api`
- [ ] `vercel.json` present for SPA routing
- [ ] Login, register, home, and bookmarks routes work on refresh

### Final Integration
- [ ] `FRONTEND_URL` on Render matches Vercel URL exactly
- [ ] CORS allows frontend requests (no browser CORS errors)
- [ ] Auth (register/login) works end-to-end
- [ ] Bookmarks save and load correctly

---

## 7. Troubleshooting

| Issue | Likely cause | Fix |
| ----- | ------------ | --- |
| CORS error in browser | `FRONTEND_URL` mismatch | Set exact Vercel URL on Render (no trailing slash) |
| `Network Error` on API calls | Wrong `VITE_API_URL` | Verify Render URL + `/api` suffix in Vercel env vars |
| 404 on page refresh | Missing SPA rewrite | Confirm `frontend/vercel.json` is deployed |
| MongoDB connection failed | Atlas network/IP rules | Allow `0.0.0.0/0` or Render outbound IPs |
| Render cold start delay | Free tier spins down | First request after idle may take ~30–60 seconds |
| JWT errors | Missing or changed `JWT_SECRET` | Use the same secret across redeploys |

---

## 8. Files Modified for Production

| File | Purpose |
| ---- | ------- |
| `backend/server.js` | CORS config, env validation, graceful shutdown, `0.0.0.0` binding |
| `backend/.env.example` | Template for all backend environment variables |
| `backend/package.json` | `start` script and Node engine requirement |
| `backend/middleware/errorMiddleware.js` | CORS error handling in production |
| `frontend/src/services/api.js` | Reads API URL from `VITE_API_URL` |
| `frontend/.env.development` | Local API URL |
| `frontend/.env.production` | Production API URL template |
| `frontend/vercel.json` | SPA rewrites for React Router |
