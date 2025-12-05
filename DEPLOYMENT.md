# Deployment Guide

## Architecture Overview

```
Frontend (Vercel/Railway) ──> Backend (Railway) ──> SQL Server Database (Azure/Cloud)
```

## Prerequisites

- [ ] Railway account (https://railway.app)
- [ ] Vercel account (optional for frontend)
- [ ] SQL Server database hosted on cloud (Azure SQL, AWS RDS, or other provider)
- [ ] GitHub repository connected

## Step 1: Deploy SQL Server Database

### Option A: Azure SQL Database (Recommended)
1. Create Azure SQL Database instance
2. Configure firewall to allow connections
3. Run database scripts in this order:
   ```bash
   1. database/schema.sql
   2. database/triggers.sql
   3. database/procs.sql
   4. database/seed.sql
   ```
4. Note your connection details:
   - Server: `your-server.database.windows.net`
   - Port: `1433`
   - Database: `OnlineBookstore`
   - Username: `your-username`
   - Password: `your-password`

### Option B: Free SQL Server Hosting
- **Somee.com** (free tier with limitations)
- **SmartASP.NET** (paid hosting)

## Step 2: Deploy Backend to Railway

### Method 1: Deploy from GitHub (Recommended)

1. **Create New Project in Railway**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - **Important:** Set root directory to `/backend`

2. **Configure Environment Variables**
   - Go to your service → Variables tab
   - Add the following:
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=your-sql-server-host.database.windows.net
   DB_PORT=1433
   DB_USER=your-username
   DB_PASSWORD=your-secure-password
   DB_NAME=OnlineBookstore
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
   JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production-min-32-chars
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   REORDER_QTY=50
   ```

3. **Configure Build Settings**
   - Railway should auto-detect Node.js
   - Build command: `npm install`
   - Start command: `node server.js` (automatically configured)

4. **Deploy**
   - Railway will automatically deploy
   - Note your backend URL: `https://your-backend.up.railway.app`

### Method 2: Deploy via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to backend directory
cd backend

# Initialize Railway project
railway init

# Link to existing project (or create new)
railway link

# Add environment variables
railway variables set NODE_ENV=production
railway variables set DB_HOST=your-server.database.windows.net
railway variables set DB_PORT=1433
railway variables set DB_USER=your-username
railway variables set DB_PASSWORD=your-password
railway variables set DB_NAME=OnlineBookstore
railway variables set JWT_SECRET=your-jwt-secret-min-32-chars
railway variables set JWT_REFRESH_SECRET=your-refresh-secret

# Deploy
railway up
```

## Step 3: Deploy Frontend to Vercel

1. **Update API Configuration**
   
   Update `frontend/src/lib/api.ts` with your Railway backend URL:
   ```typescript
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.up.railway.app';
   ```

2. **Deploy to Vercel**
   
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Navigate to frontend directory
   cd frontend

   # Deploy
   vercel
   ```

3. **Configure Environment Variables in Vercel**
   - Go to your project settings on Vercel
   - Add environment variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
     ```

### Alternative: Deploy Frontend to Railway

```bash
cd frontend
railway init
railway link
railway variables set NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
railway up
```

## Step 4: Configure CORS

Update `backend/server.js` to allow your frontend domain:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-frontend.vercel.app',
  'https://your-frontend.up.railway.app'
];
```

## Step 5: Test Deployment

1. Visit your frontend URL
2. Test user registration and login
3. Test book browsing and cart functionality
4. Verify database connections are working

## Troubleshooting

### Backend won't start on Railway
- Check Railway logs: `railway logs`
- Verify all environment variables are set
- Ensure SQL Server allows connections from Railway's IP
- Check that `railway.json` is in the backend directory

### Database connection fails
- Verify firewall rules on SQL Server
- Check connection string format
- Ensure SSL/TLS is properly configured
- Test connection locally first

### Frontend can't reach backend
- Verify CORS settings
- Check `NEXT_PUBLIC_API_URL` environment variable
- Ensure backend is deployed and running
- Check browser console for errors

## Monitoring and Maintenance

### Railway
- View logs: Project → Service → Logs
- View metrics: Project → Service → Metrics
- Scale as needed: Project → Service → Settings

### Database
- Monitor connection pool usage
- Set up automated backups
- Monitor query performance
- Review error logs regularly

## Security Checklist

- [ ] Changed all default passwords
- [ ] Generated strong JWT secrets (minimum 32 characters)
- [ ] Configured CORS properly
- [ ] Enabled HTTPS only
- [ ] Database uses encrypted connections
- [ ] Firewall rules restrict database access
- [ ] Environment variables not committed to git
- [ ] Rate limiting configured
- [ ] Input validation enabled

## Cost Estimation

- **Railway Backend**: Free tier ($5/month credit) or ~$5-20/month
- **Vercel Frontend**: Free tier or $20/month Pro
- **Azure SQL Database**: ~$5-50/month depending on tier
- **Total**: Can start free, production ~$10-90/month

## Alternative: Deploy Everything to Railway

You can deploy both frontend and backend to Railway:

1. Create separate Railway services for backend and frontend
2. Set root directory accordingly
3. Configure environment variables
4. Railway handles deployment automatically

## Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Azure SQL Docs: https://learn.microsoft.com/azure/azure-sql/
