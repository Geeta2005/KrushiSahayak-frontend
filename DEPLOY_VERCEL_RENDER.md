# Quick Deploy: Vercel + Render

**One-page deployment guide for Vercel (Frontend) + Render (Backend)**

---

## Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB Atlas IP whitelist set to `0.0.0.0/0` (allow all)
- [ ] Have your MongoDB Atlas connection string ready

---

## Step 1: Deploy Backend (Render)

**URL:** https://dashboard.render.com

| Setting | Value |
|---------|-------|
| **Service Type** | Web Service |
| **Name** | `krushisahayak-backend` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

**Environment Variables:**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.00lsjyf.mongodb.net/KrushiSahayak?appName=Cluster0
JWT_SECRET=change-this-to-random-32-characters
JWT_EXPIRE=30d
FRONTEND_URL=https://krushisahayak.vercel.app
```

**Copy your backend URL:** `https://krushisahayak-backend.onrender.com`

---

## Step 2: Deploy Frontend (Vercel)

**URL:** https://vercel.com

| Setting | Value |
|---------|-------|
| **Framework** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

**Environment Variable:**
```
VITE_API_URL=https://krushisahayak-backend.onrender.com/api
```

**Copy your frontend URL:** `https://krushisahayak.vercel.app`

---

## Step 3: Update Backend CORS

Go back to Render Dashboard → Your Backend → **Environment**

Update `FRONTEND_URL`:
```
FRONTEND_URL=https://krushisahayak.vercel.app
```

Click **Save Changes** (auto-redeploys)

---

## Step 4: Test

**Health Check:**
```
https://krushisahayak-backend.onrender.com/health
```

Should return:
```json
{
  "status": "OK",
  "environment": "production"
}
```

**Test Frontend:**
- Register a new user
- Login
- Browse equipment

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error | Update `FRONTEND_URL` in Render to match exact Vercel URL |
| MongoDB timeout | Check Atlas IP whitelist, verify connection string |
| 404 API errors | Verify `VITE_API_URL` ends with `/api` |
| Build fails | Check `npm run build` works locally first |

---

## Important URLs After Deployment

| Service | URL Pattern |
|---------|-------------|
| Frontend | `https://[project-name].vercel.app` |
| Backend | `https://[service-name].onrender.com` |
| Health | `https://[backend]/health` |
| API | `https://[backend]/api` |

---

## Post-Deploy: Create Admin User

In Render Dashboard → Backend → **Shell**

```bash
cd backend
node seedAdmin.js
```

**Default Admin:**
- Email: `admin@krushisahayak.com`
- Password: `admin123` ⚠️ Change immediately!

---

## Files Created for Deployment

```
├── render.yaml          # Render blueprint (auto-detected)
├── vercel.json          # Vercel configuration
├── vite.config.ts       # Updated for production
├── src/
│   └── vite-env.d.ts   # TypeScript types for env vars
└── DEPLOYMENT.md        # Full detailed guide
```

---

**Need help?** Check `DEPLOYMENT.md` for detailed instructions.
