# AgriHub - GitHub Pages & GitHub Actions Setup

## What's Been Configured

✅ **GitHub Pages Deployment**
- Vite configured with base path `/AgriHub/`
- React Router uses dynamic basename
- Optimized build configuration

✅ **GitHub Actions CI/CD**
- Automatic deployment on push to main
- ESLint code quality checks
- Node.js build verification

✅ **API Integration Ready**
- Environment-based API URL configuration
- CORS-compatible axios setup
- Support for both local and production backends

## Quick Start

### 1. Create GitHub Repository
Visit https://github.com/new and create:
- **Repository name:** AgriHub
- **Owner:** Khaja2988
- **Visibility:** Public
- **Initialize:** Without README

### 2. Set Backend API URL
Create `.env.production` in `AgriConnectFrontend/`:
```
VITE_API_URL=https://your-backend-api.com
```

Or update GitHub Actions workflow:
Edit `.github/workflows/deploy.yml` line 33 to set your backend URL

### 3. Push Code to GitHub
```powershell
cd c:\Users\valik\OneDrive\Desktop\GIGPOINT\GIGPOINT\GIGPOINT\AgriConnect-main
git remote -v  # Verify remote is https://github.com/Khaja2988/AgriHub.git
git add .
git commit -m "Initial commit: Configure for GitHub Pages deployment"
git branch -M main
git push -u origin main
```

### 4. Enable GitHub Pages
1. Go to Repository Settings → Pages
2. Source: **GitHub Actions** (auto-configured)
3. Wait for first deployment to complete

### 5. Access Your Site
Site will be live at: **https://khaja2988.github.io/AgriHub/**

## Backend Deployment Recommendations

| Platform | Cost | Ease | Speed |
|----------|------|------|-------|
| **Heroku** | Free tier available | ⭐⭐⭐ | Fast |
| **Railway** | $5-20/month | ⭐⭐⭐ | Fast |
| **Render** | Free tier available | ⭐⭐⭐ | Moderate |
| **Azure App Service** | Pay-as-you-go | ⭐⭐ | Fast |

### Heroku Example
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-agriconnect-api

# Deploy
git push heroku main

# Set backend URL in frontend
# VITE_API_URL=https://your-agriconnect-api.herokuapp.com
```

## Files Created/Modified

- `vite.config.js` - Added base path for GitHub Pages
- `src/main.jsx` - Updated BrowserRouter with dynamic basename
- `.github/workflows/deploy.yml` - Auto-deploy to GitHub Pages
- `.github/workflows/ci.yml` - Code quality checks
- `.env.example` - API URL configuration template
- `.gitignore` - Prevents sensitive files from being committed
- `GITHUB_PAGES_SETUP.md` - Detailed setup guide

## Important Notes

⚠️ **CORS Requirement**
Your backend must have CORS enabled for requests from:
```
https://khaja2988.github.io/AgriHub/
http://localhost:3000  (for local development)
```

⚠️ **Environment Variables**
Never commit `.env` files to GitHub. Only `.env.example` should be in version control.

⚠️ **API URL Changes**
Update `VITE_API_URL` whenever backend URL changes:
- Development: `http://localhost:5000`
- Production: `https://your-backend.com`

## Troubleshooting

**Site shows 404**
- Check that base path in vite.config.js matches repository name
- Verify React Router basename is set correctly

**API calls failing**
- Check backend CORS settings
- Verify `VITE_API_URL` is correct
- Check browser console for actual error

**GitHub Actions failing**
- Click Actions tab to view build logs
- Check npm dependencies are installed
- Verify Node.js version is compatible

## Support & Documentation

- [Vite Documentation](https://vitejs.dev/)
- [GitHub Pages Guide](https://pages.github.com/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [React Router Deployment](https://reactrouter.com/en/main/start/deployment)
