# Deployment Guide - Covezi Frontend

## Deploy to Vercel

### Prerequisites
- Node.js 16+ installed
- Vercel CLI installed: `npm install -g vercel`
- GitHub account with repository access

### Steps to Deploy

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build the Project**
   ```bash
   npm run build
   ```

3. **Preview Build Locally**
   ```bash
   npm run preview
   ```

4. **Deploy to Vercel**
   
   Option A: Using Vercel CLI
   ```bash
   vercel
   ```
   
   Option B: Connect GitHub to Vercel
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Select your GitHub repository `CHUINZDAZLAG/Covezi_Frontend`
   - Import the project
   - Vercel will auto-deploy on every push to `develop` branch

### Environment Variables on Vercel

Set these environment variables in Vercel project settings:
```
BUILD_MODE=production
VITE_APP_TITLE=Covezi
```

The backend API URL is configured in `src/utils/constants.js`:
- Development: `http://localhost:8017`
- Production: Will use the backend production URL (update as needed)

### Build Configuration

- **Framework**: Vite + React
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Features Included

- ✅ React 18 with Vite for fast development
- ✅ Redux Toolkit for state management
- ✅ Material-UI (MUI) components
- ✅ Responsive design
- ✅ Challenge management
- ✅ Gamification system
- ✅ Admin dashboard
- ✅ Product and voucher management

### Troubleshooting

**Build fails with memory error:**
```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

**Port already in use:**
```bash
npm run dev -- --port 3000
```

**Clear cache and rebuild:**
```bash
rm -rf node_modules dist
npm install
npm run build
```

### After Deployment

- Update the backend API URL in `src/utils/constants.js` for production
- Test all features in the production environment
- Monitor Vercel dashboard for build and runtime errors

---

For more info, visit: https://vercel.com/docs
