# GitHub Pages Deployment Guide

## Prerequisites
- GitHub account (https://github.com/Khaja2988)
- Repository created at: https://github.com/Khaja2988/AgriHub
- Backend server deployed and accessible via a public URL

## Setup Instructions

### 1. Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `AgriHub`
3. Make it **Public** (required for GitHub Pages free tier)
4. Initialize without README (we already have one)

### 2. Configure Backend API URL
The frontend needs to know where your backend is deployed. Update the API URL before deployment:

**Option A: Using Environment Variables (Recommended)**
```bash
cd AgriConnectFrontend
cp .env.example .env.production
```

Edit `.env.production` and update `VITE_API_URL`:
```
VITE_API_URL=https://your-backend-url.com
```

**Option B: Update for Production Build**
Edit `.github/workflows/deploy.yml` to set environment variables:
```yaml
- name: Build frontend
  working-directory: ./AgriConnectFrontend
  env:
    VITE_API_URL: https://your-backend-url.com
  run: npm run build
```

### 3. Enable GitHub Pages in Repository Settings
1. Go to Repository → Settings → Pages
2. Under "Build and deployment":
   - Source: **GitHub Actions** (or Deploy from branch if manual)
   - If using "Deploy from branch": select `gh-pages` branch and `/root` folder

### 4. Push Code to GitHub
```bash
cd AgriConnect-main
git branch -M main
git push -u origin main
```

### 5. GitHub Actions Deployment
- Workflows will run automatically on push
- View progress in Actions tab
- First deployment takes ~2-3 minutes
- Site will be available at: https://khaja2988.github.io/AgriHub/

## Backend Deployment Options

### Option 1: Heroku (Recommended for Free Tier)
```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
git push heroku main
```
Backend URL: `https://your-app-name.herokuapp.com`

### Option 2: Railway
1. Connect GitHub repository
2. Deploy from main branch
3. Set environment variables in Railway dashboard

### Option 3: Azure App Service
```bash
az webapp create --resource-group MyResourceGroup --plan MyAppServicePlan --name MyAppName
```

### Option 4: Render.com
1. Connect GitHub repository
2. Select Backend directory
3. Deploy

## Frontend React Router Configuration

Since GitHub Pages serves from `/AgriHub/`, ensure React Router uses correct basename:

In `src/main.jsx`:
```jsx
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter basename="/AgriHub">
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
```

## CORS Configuration

If backend is on different domain, configure CORS:

**Backend (Node.js):**
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://khaja2988.github.io/AgriHub/', 'http://localhost:3000'],
  credentials: true
}));
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 errors on page refresh | Check React Router basename matches `/AgriHub/` |
| API calls failing | Verify `VITE_API_URL` points to correct backend |
| GitHub Actions fails | Check build logs in Actions tab |
| CORS errors | Update backend CORS configuration |
| Site not loading | Wait 2-3 minutes after first deploy, check branch settings |

## Next Steps
1. Create GitHub repository
2. Update backend API URL
3. Push code to GitHub
4. Monitor deployment in Actions tab
5. Update backend CORS settings
