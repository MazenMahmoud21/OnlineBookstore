# Render Deployment Guide for Online Bookstore

## ✅ Current Configuration

Your Render setup looks correct! Here's what you have:

- **Service Type**: Web Service
- **Runtime**: Docker
- **Root Directory**: `/backend` ✅
- **Dockerfile Path**: `.` (relative to root directory)
- **Branch**: `main`
- **Region**: Virginia (US East)

## 🔧 Required Environment Variables

Add these environment variables in the Render dashboard:

### Required (Add Now):

```
NODE_ENV=production
PORT=5000
DB_HOST=your-sql-server.database.windows.net
DB_PORT=1433
DB_USER=your-database-username
DB_PASSWORD=your-database-password
DB_NAME=OnlineBookstore
JWT_SECRET=your-jwt-secret-min-32-characters-long-random-string
JWT_REFRESH_SECRET=your-refresh-secret-min-32-characters-long
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
REORDER_QTY=50
```

### Generate Secure Secrets:

For JWT secrets, use this command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run it twice to generate both `JWT_SECRET` and `JWT_REFRESH_SECRET`.

## 📦 Instance Type Selection

Your current selection: **Free** ($0/month)

**Free Tier Limitations:**
- ⚠️ Service spins down after 15 minutes of inactivity
- ⚠️ Cold starts can take 30+ seconds
- ✅ Good for testing and demos
- ✅ 512 MB RAM, 0.1 CPU

**Recommended for Production:**
- **Starter** ($7/month): Better for real use, no sleep
- **Standard** ($25/month): Production-ready with more resources

## 🗄️ Database Setup Required

**Before deploying, you need a SQL Server database:**

### Option 1: Azure SQL Database (Recommended)
1. Go to https://portal.azure.com
2. Create "SQL Database"
3. Choose "Basic" tier (~$5/month) or "Standard"
4. Note connection details
5. Configure firewall to allow connections from `0.0.0.0` (all IPs)
6. Run your SQL scripts:
   - `database/schema.sql`
   - `database/triggers.sql`
   - `database/procs.sql`
   - `database/seed.sql`

### Option 2: Free SQL Server Hosting
- **Somee.com**: Free tier available
- **SmartASP.NET**: Affordable hosting

### Option 3: Add SQL Server to Render
Render doesn't have native SQL Server support, but you can:
- Use their PostgreSQL database (requires code changes)
- Use external SQL Server hosting

## 🚀 Deployment Steps

### Step 1: Set Up Database First
Don't deploy until you have a working SQL Server database with connection details.

### Step 2: Add Environment Variables
In Render dashboard, add all the environment variables listed above.

### Step 3: Deploy Backend
Click **"Deploy web service"** button at the bottom.

### Step 4: Deploy Frontend
After backend is deployed:
1. Create another web service
2. Set root directory to: `/frontend`
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com
   ```

### Step 5: Update CORS
Once frontend is deployed, update backend CORS to allow frontend domain.

## ⚠️ Important Notes

1. **Dockerfile Path**: You have it set to `.` which is correct when root directory is `/backend`

2. **Port**: Render automatically exposes port 5000 (defined in your Dockerfile)

3. **Health Checks**: Render will ping your service. Make sure your server responds to HTTP requests.

4. **Database Connection**: 
   - Ensure your SQL Server allows connections from Render's IPs
   - Azure SQL: Add IP range `0.0.0.0 - 255.255.255.255` for testing
   - For production: Restrict to specific IPs

5. **Free Tier Sleep**: 
   - Service sleeps after 15 min inactivity
   - First request after sleep takes 30+ seconds
   - Consider Starter plan ($7/mo) to avoid this

## 🔍 Troubleshooting

### Build Fails
- Check Render logs in the dashboard
- Verify Dockerfile is in `backend/` directory
- Ensure `package-lock.json` exists (it does now ✅)

### Service Won't Start
- Check environment variables are set correctly
- View logs in Render dashboard
- Verify database is accessible

### Can't Connect to Database
- Check SQL Server firewall rules
- Verify connection string format
- Ensure DB credentials are correct
- Try connecting from your local machine first

## 📊 Cost Estimate

**Minimal Setup:**
- Backend (Free): $0
- Frontend (Free): $0
- Azure SQL Basic: $5/month
- **Total: $5/month**

**Production Setup:**
- Backend (Starter): $7/month
- Frontend (Starter): $7/month
- Azure SQL Standard: $15-50/month
- **Total: $29-64/month**

## ✅ Deployment Checklist

Before clicking "Deploy web service":

- [ ] SQL Server database is set up and accessible
- [ ] Database scripts have been run (schema, triggers, procs, seed)
- [ ] All environment variables added to Render
- [ ] JWT secrets generated (32+ characters each)
- [ ] Database firewall allows external connections
- [ ] Tested database connection locally

## 🎯 Next Steps

1. ⬜ Set up SQL Server database
2. ⬜ Add all environment variables in Render
3. ⬜ Click "Deploy web service"
4. ⬜ Wait for build to complete (~5 minutes)
5. ⬜ Test backend API endpoints
6. ⬜ Deploy frontend service
7. ⬜ Update backend CORS settings

---

**Need help?** 
- Render Docs: https://render.com/docs
- Render Support: https://render.com/support
