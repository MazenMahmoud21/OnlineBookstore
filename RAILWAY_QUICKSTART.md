# Quick Railway Deployment Fix

## ✅ Fixed Issues

1. **Created `package-lock.json`** for backend
2. **Added Railway configuration files:**
   - `backend/railway.json` - Railway service config
   - `frontend/railway.json` - Railway service config
   - `backend/nixpacks.toml` - Nixpacks build config
   - `frontend/nixpacks.toml` - Nixpacks build config

## 🚀 Deploy to Railway Now

### Step 1: Commit and Push Changes

```bash
git add .
git commit -m "Add Railway deployment configuration and package-lock.json"
git push origin main
```

### Step 2: Deploy Backend

1. Go to https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository: `MazenMahmoud21/OnlineBookstore`
4. ⚠️ **IMPORTANT**: In settings, set **Root Directory** to: `backend`
5. Add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=<your-sql-server-host>
   DB_PORT=1433
   DB_USER=<your-username>
   DB_PASSWORD=<your-password>
   DB_NAME=OnlineBookstore
   JWT_SECRET=<generate-32-char-secret>
   JWT_REFRESH_SECRET=<generate-32-char-secret>
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   REORDER_QTY=50
   ```
6. Deploy!
7. Copy your backend URL: `https://xxxxx.up.railway.app`

### Step 3: Deploy Frontend

1. In the same Railway project, click **"New Service"**
2. Select **"GitHub Repo"** → Same repository
3. ⚠️ **IMPORTANT**: In settings, set **Root Directory** to: `frontend`
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.up.railway.app
   ```
5. Deploy!

### Step 4: Update Backend CORS

After both are deployed, you need to update CORS in your backend to allow the frontend domain.

## 🗄️ Database Setup

You still need to set up your SQL Server database. Options:

### Option 1: Azure SQL Database (Recommended)
- Create at https://portal.azure.com
- ~$5-50/month depending on size
- Reliable and production-ready

### Option 2: Free Hosting
- **Somee.com** - Free SQL Server (limited)
- Run your SQL scripts in order:
  1. `database/schema.sql`
  2. `database/triggers.sql`
  3. `database/procs.sql`
  4. `database/seed.sql`

## 📝 What Changed

### Backend Configuration
- ✅ Created `package-lock.json` (Railway needs this)
- ✅ Added `nixpacks.toml` (tells Railway how to build)
- ✅ Added `railway.json` (Railway service config)
- ✅ Updated to use `npm install --omit=dev` instead of `npm ci`

### Frontend Configuration
- ✅ Added `nixpacks.toml`
- ✅ Added `railway.json`

## ❓ Common Issues

**Q: Still getting build errors?**
- Make sure you set the **Root Directory** correctly (`backend` or `frontend`)
- Check that environment variables are set
- View logs in Railway dashboard

**Q: Database connection fails?**
- Verify SQL Server allows external connections
- Check firewall rules
- Ensure credentials are correct

**Q: Frontend can't reach backend?**
- Check `NEXT_PUBLIC_API_URL` is set correctly
- Verify backend is running (check Railway logs)
- Update CORS settings in backend

## 🎯 Next Steps

1. ✅ Commit and push these changes
2. ⬜ Set up SQL Server database
3. ⬜ Deploy backend to Railway (root: `backend`)
4. ⬜ Deploy frontend to Railway (root: `frontend`)
5. ⬜ Test your deployed application!

---

**Full documentation:** See `DEPLOYMENT.md` for detailed instructions
