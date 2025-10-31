# 🔧 Fixing the Vercel 403 "Access Denied" Error

## What Was the Problem?

Your backend was returning **403 "Access denied"** because:
- The backend code was configured as a traditional Node.js server with `httpServer.listen()`
- Vercel serverless functions need to export an Express handler, not start a server
- The app couldn't initialize properly in Vercel's serverless environment

## ✅ What I Fixed

I've just pushed fixes to your branch that include:

1. **Created `backend/api/index.ts`** - A Vercel-compatible serverless handler
2. **Updated `backend/vercel.json`** - Points to the new serverless entry point
3. **Made database initialization resilient** - Won't crash if DB isn't configured yet
4. **Optimized for serverless** - Reduced connection pool size

---

## 🚀 Steps to Fix Your Deployment

### Step 1: Redeploy Backend on Vercel

Your code is already pushed to GitHub. Now redeploy on Vercel:

**Option A: Automatic (if connected to GitHub)**
1. Go to [vercel.com](https://vercel.com)
2. Find your backend project
3. Vercel should auto-detect the new push and redeploy
4. Wait ~2-3 minutes for deployment

**Option B: Manual Redeploy**
1. Go to your backend project on Vercel
2. Click **"Deployments"** tab
3. Click **"Redeploy"** on the latest deployment
4. Wait for completion

---

### Step 2: Set Backend Environment Variables

You **MUST** set these environment variables in Vercel for the backend to work:

1. Go to your backend project on Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add each of these:

```bash
# OpenAI (REQUIRED for AI features)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Zoom (REQUIRED for Zoom integration)
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_WEBHOOK_SECRET_TOKEN=your_webhook_secret
ZOOM_REDIRECT_URI=https://side-kick-frontend-mauve.vercel.app/auth/zoom/callback

# Database (REQUIRED for storing checklists)
DATABASE_URL=postgresql://your-supabase-connection-string

# JWT Security (REQUIRED for authentication)
JWT_SECRET=your-generated-jwt-secret
JWT_EXPIRES_IN=7d

# URLs (REQUIRED for CORS)
FRONTEND_URL=https://side-kick-frontend-mauve.vercel.app
NODE_ENV=production
```

4. Click **"Save"** for each variable
5. Vercel will automatically redeploy after saving

---

### Step 3: Initialize Database

After setting environment variables, initialize your database:

**Option A: Using Your Local Machine**

```bash
cd backend

# Set DATABASE_URL temporarily (use your Supabase connection string)
export DATABASE_URL="postgresql://postgres.xxx:password@db.xxx.pooler.supabase.com:6543/postgres"

# Install dependencies
npm install

# Push database schema
npm run db:push

# Seed with default templates
npm run db:seed
```

**Expected Output:**
```
✓ Pushing schema changes to database
✓ Done!

Starting database seeding...
Inserted template: Discovery Call
Inserted template: Product Demo
Inserted template: Closing Call
Inserted template: Follow-up Call
Inserted template: Qualification Call
Database seeding completed successfully
```

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI if not installed
npm install -g vercel

# Link to your project
cd backend
vercel link

# Run database commands with production env
vercel env pull .env.production
npm run db:push
npm run db:seed
```

---

### Step 4: Verify Backend is Working

Test your backend with these commands:

```bash
# Test health endpoint
curl https://side-kick-backend-7spbdqe3b-soorajs-projects-7db04cce.vercel.app/health

# Expected: {"status":"ok","timestamp":"2025-..."}
```

```bash
# Test templates API
curl https://side-kick-backend-7spbdqe3b-soorajs-projects-7db04cce.vercel.app/api/templates

# Expected: Array of 5 template objects with Discovery Call, Product Demo, etc.
```

**If you still get 403 or empty array:**
- Check Vercel deployment logs: Dashboard → Project → Deployments → Click latest → View Function Logs
- Verify all environment variables are set correctly
- Ensure DATABASE_URL is set and database is seeded

---

### Step 5: Update Frontend Environment Variable

The frontend needs to know your backend URL:

1. Go to your **frontend** project on Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add or update:

```bash
VITE_BACKEND_URL=https://side-kick-backend-7spbdqe3b-soorajs-projects-7db04cce.vercel.app
```

4. **Important:** After saving, you MUST redeploy the frontend:
   - Go to **"Deployments"** tab
   - Click **"Redeploy"** on latest deployment

---

## 🧪 Complete Test Checklist

After completing all steps, test in this order:

### Test 1: Backend Health
```bash
curl https://side-kick-backend-7spbdqe3b-soorajs-projects-7db04cce.vercel.app/health
```
✅ Should return: `{"status":"ok","timestamp":"..."}`

### Test 2: Backend Templates API
```bash
curl https://side-kick-backend-7spbdqe3b-soorajs-projects-7db04cce.vercel.app/api/templates
```
✅ Should return: Array with 5 templates

### Test 3: Frontend Loads
1. Open: https://side-kick-frontend-mauve.vercel.app/
2. ✅ Should see SideKick UI (not white screen)

### Test 4: Templates Load in Frontend
1. Open browser console (F12)
2. Refresh page
3. ✅ Check Network tab - API call to `/api/templates` should succeed
4. ✅ Should see templates in the UI

### Test 5: Zoom App Integration
1. Open Zoom desktop client
2. Start a meeting
3. Click **"Apps"** button
4. Find **"SideKick"** app
5. ✅ App should open in sidebar with templates visible

---

## 🐛 Troubleshooting

### Issue: Backend still returns 403

**Check:**
```bash
# View Vercel function logs
# Go to: Vercel Dashboard → Backend Project → Deployments → Latest → Function Logs
```

**Common causes:**
- Environment variables not set in Vercel
- FRONTEND_URL not matching your actual frontend URL
- Old deployment still running (force redeploy)

### Issue: Backend returns 500 or database error

**Check:**
1. Verify DATABASE_URL is set in Vercel
2. Check DATABASE_URL format (must use port 6543 for Supabase pooler)
3. Run `npm run db:push` to ensure schema is up to date
4. Check Supabase dashboard to ensure database is not paused

### Issue: Templates API returns empty array []

**This means database is not seeded:**
```bash
cd backend
export DATABASE_URL="your-connection-string"
npm run db:seed
```

### Issue: Frontend still shows white screen

**Check:**
1. Is VITE_BACKEND_URL set in Vercel frontend?
2. Did you redeploy frontend after setting env var?
3. Open browser console (F12) - look for error messages
4. Check Network tab - is frontend calling the correct backend URL?

### Issue: CORS errors in browser

**Check:**
1. FRONTEND_URL environment variable in backend matches your actual frontend URL
2. No trailing slash in FRONTEND_URL
3. Both URLs use HTTPS (not HTTP)

---

## 📊 Environment Variables Quick Reference

### Backend Vercel Environment Variables:
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
ZOOM_CLIENT_ID=...
ZOOM_CLIENT_SECRET=...
ZOOM_WEBHOOK_SECRET_TOKEN=...
ZOOM_REDIRECT_URI=https://side-kick-frontend-mauve.vercel.app/auth/zoom/callback
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://side-kick-frontend-mauve.vercel.app
NODE_ENV=production
```

### Frontend Vercel Environment Variables:
```
VITE_BACKEND_URL=https://side-kick-backend-7spbdqe3b-soorajs-projects-7db04cce.vercel.app
```

---

## ✅ Success Criteria

You'll know everything is working when:

1. ✅ `curl` to `/health` returns status OK
2. ✅ `curl` to `/api/templates` returns 5 templates
3. ✅ Frontend loads without white screen
4. ✅ Templates appear in frontend UI
5. ✅ Zoom app opens and shows SideKick interface

---

## 🎉 Next Steps After Fix

Once backend is working:

1. **Configure Zoom App URLs** (see docs/ZOOM_APP_CONFIGURATION.md):
   - Home URL: `https://side-kick-frontend-mauve.vercel.app`
   - Webhook URL: `https://side-kick-backend-7spbdqe3b-soorajs-projects-7db04cce.vercel.app/api/webhooks/zoom`
   - Redirect URL: `https://side-kick-frontend-mauve.vercel.app/auth/zoom/callback`

2. **Test in Zoom Meeting**:
   - Create checklist
   - Start Zoom transcription
   - Watch AI auto-check items!

---

## 📞 Still Need Help?

If you're still stuck after following all these steps:

1. **Check Vercel Logs:**
   - Backend: Deployments → Latest → Function Logs
   - Frontend: Deployments → Latest → Build Logs

2. **Run automated test script:**
   ```bash
   cd /home/user/SideKick
   bash scripts/test-deployment.sh
   ```

3. **Verify database connection:**
   ```bash
   cd backend
   export DATABASE_URL="your-connection-string"
   npm run db:push
   ```

---

**The fixes are pushed to your branch. Follow the steps above to complete the deployment!** 🚀
