# 🚀 Complete Deployment Guide - AgriHub Backend & Frontend Integration

## Overview
- **Frontend**: React app deployed on GitHub Pages
- **Backend**: Node.js Express API on Railway
- **Database**: MongoDB Atlas

---

## 📋 Step 1: Deploy Backend to Railway (5 minutes)

### 1.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (recommended)
3. Allow GitHub authorization

### 1.2 Create New Project
1. Click "New Project" → "Deploy from GitHub repo"
2. Select your repository: `Khaja2988/AgriHub`
3. Click "Deploy"

### 1.3 Configure Environment Variables
Railway will auto-detect your backend, but you need to add environment variables:

1. Go to your Railway project dashboard
2. Click on the deployed service (should be named "backend")
3. Click "Variables" tab
4. Add these variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `PORT` | `5000` | Railway assigns automatically |
| `NODE_ENV` | `production` | Use production mode |
| `MONGODB_URI` | Your MongoDB connection string | From your `.env` file |
| `JWT_SECRET` | Your JWT secret | From your `.env` file |

**Where to get these values:**
- Open `backend/.env` in your local project
- Copy the values from there

### 1.4 Get Backend URL
1. In Railway dashboard, find the "Domains" section
2. You'll see a URL like: `https://your-agrihub-backend.railway.app`
3. **Save this URL** - you'll need it next

---

## 🔗 Step 2: Connect Frontend to Backend

### 2.1 Update Frontend API URL

Edit `.github/workflows/deploy.yml` and add your backend URL:

```yaml
- name: Build frontend
  working-directory: ./AgriConnectFrontend
  env:
    VITE_API_URL: https://your-agrihub-backend.railway.app
  run: npm run build
```

**Replace** `https://your-agrihub-backend.railway.app` with your actual Railway backend URL.

### 2.2 Update CORS Configuration

The backend needs to allow requests from your frontend. Edit `backend/src/app.js`:

Find the CORS configuration and update it to include your GitHub Pages URL:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://khaja2988.github.io/AgriHub',  // Production GitHub Pages
    'http://localhost:3000',                 // Local development
    'http://localhost:5000',                 // Local backend
    'http://127.0.0.1:3000',                 // Alternative local
    'http://127.0.0.1:5000'                  // Alternative local
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2.3 Push Changes to GitHub

```bash
cd c:\Users\valik\OneDrive\Desktop\GIGPOINT\GIGPOINT\GIGPOINT\AgriConnect-main

# Stage changes
git add .github/workflows/deploy.yml backend/src/app.js

# Commit
git commit -m "Configure backend integration and CORS for GitHub Pages"

# Push to GitHub
git push origin main
```

This triggers:
- ✅ Frontend redeploy with new backend URL
- ✅ Workflow automatically runs

---

## ✅ Step 3: Verify Everything Works

### 3.1 Check Deployments

**Frontend:**
- URL: https://khaja2988.github.io/AgriHub/
- Status: Check https://github.com/Khaja2988/AgriHub/actions

**Backend:**
- URL: https://your-agrihub-backend.railway.app/api/health
- Should return: `{ "status": "ok" }`

### 3.2 Test API Connection

Open browser DevTools (F12) and go to your frontend app:
1. Open the Console tab
2. You should NOT see CORS errors
3. Try logging in - API calls should work

### 3.3 Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| CORS error in console | Check CORS config in `backend/src/app.js` - ensure GitHub Pages URL is included |
| 404 Backend URL | Verify Railway deployment completed - check the Domains section |
| Login fails | Check `MONGODB_URI` and `JWT_SECRET` in Railway environment variables |
| API returns 500 | Check Railway logs: Dashboard → Service → Logs tab |

---

## 📊 Architecture After Deployment

```
┌─────────────────────────────────────────────────────────┐
│          Browser (User's Computer)                      │
│                                                         │
│  https://khaja2988.github.io/AgriHub/  (React App)    │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP Requests
                      │ (CORS-enabled)
                      ↓
        ┌─────────────────────────┐
        │  Railway Backend Server  │
        │  Node.js + Express       │
        │  API Endpoints:          │
        │  /api/auth/*             │
        │  /api/farmers/*          │
        │  /api/orders/*           │
        │  /api/products/*         │
        └────────────┬─────────────┘
                     │ Database
                     │ Queries
                     ↓
        ┌─────────────────────────┐
        │  MongoDB Atlas           │
        │  Cloud Database          │
        └─────────────────────────┘
```

---

## 🔄 Continuous Deployment

**Every time you push to GitHub:**

1. ✅ Frontend rebuilds automatically (GitHub Actions)
2. ✅ Updated site deploys to GitHub Pages
3. ⏱️ Takes 2-3 minutes

**To deploy backend changes:**

1. Make changes to `backend/` folder
2. Commit and push: `git push origin main`
3. Railway auto-detects and redeploys
4. No manual action needed!

---

## 📱 Testing the Full Stack

### Test Farmer Registration
1. Go to https://khaja2988.github.io/AgriHub/
2. Click "Farmer" → "Register"
3. Fill in the form
4. Submit
5. Should create account in MongoDB

### Test Login
1. Go to login page
2. Use credentials you just created
3. Should receive JWT token
4. Should redirect to dashboard

### Test Product Listing
1. After login, view products
2. API should fetch from MongoDB
3. Products should display

---

## 🛠️ Maintenance & Updates

### Update Backend Code
```bash
# Make changes
git add backend/
git commit -m "Update backend"
git push origin main
# Railway auto-deploys within 1-2 minutes
```

### Update Frontend Code
```bash
# Make changes
git add AgriConnectFrontend/
git commit -m "Update frontend"
git push origin main
# GitHub Actions auto-deploys within 2-3 minutes
```

### Change Environment Variables (Backend)
1. Go to Railway dashboard
2. Click your service → Variables
3. Update values
4. Service restarts automatically

---

## 📞 Support Links

| Resource | Link |
|----------|------|
| Railway Docs | https://docs.railway.app |
| GitHub Pages | https://pages.github.com |
| MongoDB Atlas | https://www.mongodb.com/cloud/atlas |
| Express CORS | https://expressjs.com/en/resources/middleware/cors.html |

---

## ✨ You're All Set!

Your AgriHub application is now:
- ✅ Frontend live on GitHub Pages
- ✅ Backend live on Railway
- ✅ Connected and ready to use
- ✅ Auto-deploying on every push

🎉 **Start building features!**
