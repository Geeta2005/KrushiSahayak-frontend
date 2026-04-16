# Deployment Guide - KrushiSahayak

Production deployment guide for the KrushiSahayak MERN stack application.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Git
- Docker (optional, for containerized deployment)

## Environment Variables

### Backend (backend/.env)

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/KrushiSahayak?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRE=30d
FRONTEND_URL=https://your-domain.com
```

**Important:**

- `JWT_SECRET` must be at least 32 characters for security
- `MONGODB_URI` should use MongoDB Atlas for production
- `FRONTEND_URL` must match your actual frontend domain

### Frontend Environment

No `.env` file needed for frontend. The API URL is configured at build time via proxy settings in `vite.config.ts`.

## Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) ⭐ Recommended

This is the **recommended deployment setup** - Vercel for frontend (fast, global CDN) and Render for backend (reliable Node.js hosting).

#### Step 1: Deploy Backend on Render

1. **Push your code to GitHub** (ensure `render.yaml` is in root)

2. Go to [Render](https://dashboard.render.com) → **New** → **Web Service**

3. **Connect your GitHub repository**

4. **Configure the service:**
   | Setting | Value |
   |---------|-------|
   | Name | `krushisahayak-backend` |
   | Root Directory | `backend` |
   | Runtime | `Node` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |

5. **Add Environment Variables:**

   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.00lsjyf.mongodb.net/KrushiSahayak?appName=Cluster0
   JWT_SECRET=your-super-secret-32-character-key
   JWT_EXPIRE=30d
   FRONTEND_URL=https://krushisahayak-frontend.vercel.app
   ```

   ⚠️ **Important:** For `FRONTEND_URL`, use your expected Vercel URL (see step 2)

6. Click **Create Web Service**

7. Wait for deployment to complete. Copy the deployed URL:
   - Example: `https://krushisahayak-backend.onrender.com`

#### Step 2: Deploy Frontend on Vercel

1. Go to [Vercel](https://vercel.com) → **Add New Project**

2. **Import your GitHub repository**

3. **Configure Project:**
   | Setting | Value |
   |---------|-------|
   | Framework Preset | `Vite` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |

4. **Add Environment Variable:**

   ```
   VITE_API_URL=https://krushisahayak-backend.onrender.com/api
   ```

   Use the backend URL from Step 1 + `/api`

5. Click **Deploy**

6. Copy your Vercel URL (e.g., `https://krushisahayak-frontend.vercel.app`)

#### Step 3: Update Backend CORS (Important!)

1. Go back to Render Dashboard → Your Backend Service → **Environment**

2. Update `FRONTEND_URL` to match your actual Vercel URL:

   ```
   FRONTEND_URL=https://krushisahayak-frontend.vercel.app
   ```

3. Click **Save Changes** - Render will redeploy automatically

#### Step 4: Verify Deployment

✅ **Backend Health Check:**
Visit: `https://your-backend.onrender.com/health`
Should return: `{"status":"OK",...}`

✅ **Frontend:**
Visit your Vercel URL and test:

- User registration
- User login
- Equipment browsing

### Option 2: Render (Full Stack - Both Frontend + Backend)

If you prefer hosting everything on Render:

#### Backend Deployment

Same as Option 1 Step 1 above.

#### Frontend Deployment (Render Static Site)

1. Go to [Render](https://dashboard.render.com) → **New** → **Static Site**

2. Connect your GitHub repository

3. **Configure:**
   | Setting | Value |
   |---------|-------|
   | Name | `krushisahayak-frontend` |
   | Build Command | `npm install && npm run build` |
   | Publish Directory | `dist` |

4. **Add Environment Variable:**

   ```
   VITE_API_URL=https://your-backend-name.onrender.com/api
   ```

5. Click **Create Static Site**

### Option 3: Docker Deployment (Self-Hosted)

1. Create a `.env` file in project root:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/KrushiSahayak
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
FRONTEND_URL=http://your-server-ip
```

2. Build and run with Docker Compose:

```bash
docker-compose up -d --build
```

3. Access the application at `http://your-server-ip`

### Option 3: Manual VPS Deployment

1. **Clone repository:**

```bash
git clone https://github.com/yourusername/KrushiSahayak.git
cd KrushiSahayak
```

2. **Setup Backend:**

```bash
cd backend
npm install
# Create .env file with production variables
npm start
```

3. **Setup Frontend:**

```bash
cd ..
npm install
npm run build
# Serve dist/ folder with nginx or any static server
```

## MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster (M0 tier is free)
3. In Database Access, create a database user
4. In Network Access, add IP whitelist:
   - For production: Add your server's IP
   - For testing: Add `0.0.0.0/0` (allow all)
5. Get connection string from "Connect" button
6. Replace `<password>` with your database user password
7. Add to backend environment variables

## Production Checklist

### Security

- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Update MongoDB Atlas IP whitelist for production
- [ ] Enable HTTPS on frontend and backend
- [ ] Verify CORS is configured for production domain only
- [ ] Remove any test data from database

### Configuration

- [ ] Set `NODE_ENV=production` on backend
- [ ] Update `FRONTEND_URL` to match production domain
- [ ] Configure `MONGODB_URI` with Atlas connection string
- [ ] Set up environment variables on hosting platform

### Testing

- [ ] Test user registration and login
- [ ] Test equipment listing and rental booking
- [ ] Verify all API endpoints respond correctly
- [ ] Check authentication flow with JWT
- [ ] Test admin dashboard access

### Monitoring

- [ ] Set up application logging
- [ ] Configure MongoDB Atlas monitoring
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error tracking (Sentry recommended)

## Common Issues

### CORS Errors

**Error:** `Access-Control-Allow-Origin` header missing
**Solution:** Update `FRONTEND_URL` in backend `.env` to exactly match your frontend domain (include `https://` and no trailing slash)

### MongoDB Connection Failed

**Error:** `MongoDB Connection Failed: connection timed out`
**Solution:**

- Check IP whitelist in MongoDB Atlas
- Verify connection string format
- Ensure database user has proper permissions

### JWT Authentication Fails

**Error:** `Invalid token` or `Token expired`
**Solution:**

- Ensure `JWT_SECRET` is same on all server instances
- Check system time is synchronized
- Verify `JWT_EXPIRE` is set appropriately

### Build Failures

**Error:** `npm run build` fails
**Solution:**

- Ensure Node.js v18+ is installed
- Delete `node_modules` and run `npm install` again
- Check for TypeScript errors: `npx tsc --noEmit`

## Post-Deployment

After deployment, run these commands to create an admin user:

```bash
cd backend
node seedAdmin.js
```

Default admin credentials:

- Email: `admin@krushisahayak.com`
- Password: `admin123` (change immediately after first login)

## Support & Documentation

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)
