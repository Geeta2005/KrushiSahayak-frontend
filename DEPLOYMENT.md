# Deployment Guide

This guide covers deploying the KrushiSahayak MERN application.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git
- Hosting platform (Vercel, Netlify, Heroku, etc.)

## Environment Variables

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
```

### Backend (backend/.env)

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/farmrent
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url.com
```

## Deployment Options

### Option 1: Vercel (Frontend) + Render/Heroku (Backend)

#### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

#### Backend Deployment (Render)

1. Connect your GitHub repository to Render
2. Set environment variables
3. Add MongoDB URI from MongoDB Atlas
4. Deploy automatically on push

### Option 2: Vercel (Full Stack)

1. Use Vercel Serverless Functions for backend
2. Restructure project to use Vercel API routes
3. Deploy both frontend and backend together

### Option 3: Docker Deployment

1. Build Docker images for frontend and backend
2. Deploy to container registry (Docker Hub)
3. Use Docker Compose for orchestration

## Build Commands

### Frontend

```bash
npm run build
```

### Backend

```bash
cd backend
npm install
npm start
```

## Production Checklist

- [ ] Update all environment variables
- [ ] Set up MongoDB Atlas for production database
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all API endpoints
- [ ] Verify authentication flow
- [ ] Test role-based access control

## Common Issues

### CORS Errors

Ensure `FRONTEND_URL` in backend .env matches your production domain.

### MongoDB Connection

Use MongoDB Atlas for production. Update `MONGODB_URI` in backend .env.

### Build Failures

Ensure all dependencies are installed and Node.js version is compatible.

## Monitoring

Consider using:

- Sentry for error tracking
- LogRocket for session replay
- MongoDB Atlas for database monitoring
- Vercel Analytics for frontend performance

## Support

For deployment issues, check:

- Vercel documentation
- Render documentation
- MongoDB Atlas documentation
