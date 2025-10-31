# 🚀 Complete Setup Guide for Sidekick

## ✅ What's Already Done

I've fixed the backend 403 error and pushed all the code fixes to your branch. Here's what's ready:

1. ✅ Backend converted to Vercel serverless format
2. ✅ Database schema and seed script created
3. ✅ All code fixes committed and pushed

---

## 📋 What You Need to Do Now

Follow these steps in order:

### Step 1: Set Up Database in Supabase (5 minutes)

1. **Go to your Supabase project:**
   - Visit: https://supabase.com/dashboard
   - Open project: `uphayungnrbpgxpqjuyl`

2. **Run the SQL script:**
   - Click on **"SQL Editor"** in the left sidebar
   - Click **"New query"**
   - Copy the entire contents of `/home/user/SideKick/database-setup.sql`
   - Paste it into the SQL editor
   - Click **"Run"** (or press Ctrl+Enter)

3. **Verify it worked:**
   - Go to **"Table Editor"** in left sidebar
   - You should see 5 tables: `users`, `templates`, `checklists`, `transcriptions`, `checklist_matches`
   - Click on `templates` table
   - You should see 5 rows (Discovery Call, Product Demo, etc.)

**✅ Success criteria:** 5 tables created with 5 template rows in the templates table

---

### Step 2: Get Correct Database URL for Vercel

**IMPORTANT:** For Vercel serverless, you need the **pooler connection string** (port 6543), not the direct connection (port 5432).

1. In Supabase, go to **"Project Settings"** → **"Database"**
2. Scroll to **"Connection string"**
3. Select **"Connection pooling"** tab (NOT "Session mode")
4. Copy the connection string that looks like:
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

5. **Replace `[password]` with your actual password:** `Soorajk@002`
   - Since it contains `@`, you need to URL-encode it to `Soorajk%40002`
   - Final URL should be:
   ```
   postgresql://postgres.[project-ref]:Soorajk%40002@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

---

### Step 3: Set Backend Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your **backend** project
3. Click **"Settings"** → **"Environment Variables"**
4. Add these variables (one at a time):

```bash
# Database (REQUIRED)
DATABASE_URL=postgresql://postgres.[project-ref]:Soorajk%40002@aws-0-[region].pooler.supabase.com:6543/postgres

# OpenAI (REQUIRED for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Zoom (get these from Zoom Marketplace)
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_WEBHOOK_SECRET_TOKEN=your_zoom_webhook_secret
ZOOM_REDIRECT_URI=https://side-kick-frontend-mauve.vercel.app/auth/zoom/callback

# JWT Security
JWT_SECRET=b8d9f2e1c4a7b6d5e8f3a2c9d6b4e7f1a5c8b3d6e9f2a5c8b1d4e7f0a3c6b9d2
JWT_EXPIRES_IN=7d

# CORS Configuration (VERY IMPORTANT)
FRONTEND_URL=https://side-kick-frontend-mauve.vercel.app
NODE_ENV=production
```

5. **Click "Save"** after adding each variable
6. Vercel will automatically redeploy when you save

**⏰ Wait 2-3 minutes for the automatic redeployment to complete**

---

### Step 4: Set Frontend Environment Variable

1. Still in Vercel Dashboard, go to your **frontend** project
2. Click **"Settings"** → **"Environment Variables"**
3. Add this variable:

```bash
VITE_BACKEND_URL=https://side-kick-backend-7spbdqe3b-soorajs-projects-7db04cce.vercel.app
```

4. **Click "Save"**
5. **IMPORTANT:** You must manually redeploy:
   - Go to **"Deployments"** tab
   - Click **"..."** menu on the latest deployment
   - Click **"Redeploy"**
   - Wait 1-2 minutes for completion

---

### Step 5: Test Backend API

After both deployments complete, test your backend:

**Test 1: Health Check**
```bash
curl https://side-kick-backend-7spbdqe3b-soorajs-projects-7db04cce.vercel.app/health
```
**Expected response:**
```json
{"status":"ok","timestamp":"2025-10-31T..."}
```

**Test 2: Templates API**
```bash
curl https://side-kick-backend-7spbdqe3b-soorajs-projects-7db04cce.vercel.app/api/templates
```
**Expected response:**
```json
[
  {
    "id":"...",
    "name":"Discovery Call",
    "description":"Essential questions for understanding prospect needs",
    ...
  },
  ... (4 more templates)
]
```

**✅ If both tests return data, your backend is working!**

---

### Step 6: Test Frontend

1. Open: https://side-kick-frontend-mauve.vercel.app/
2. **Check browser console** (Press F12 → Console tab)
3. Look for any errors
4. You should see the Sidekick interface with templates

**✅ If you see the app UI (not white screen), frontend is working!**

---

### Step 7: Configure Zoom App

1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Click **"Manage"** → **"Published Apps"** (or "Created Apps")
3. Find your Sidekick app
4. Update these settings:

#### **Basic Information → OAuth Redirect URL:**
```
https://side-kick-frontend-mauve.vercel.app/auth/zoom/callback
```

#### **Features → Zoom App → Home URL:**
```
https://side-kick-frontend-mauve.vercel.app/
```

#### **Feature → Event Subscriptions → Add Event Subscription:**
- **Event Subscription Name:** `Sidekick Transcription`
- **Event notification endpoint URL:**
  ```
  https://side-kick-backend-7spbdqe3b-soorajs-projects-7db04cce.vercel.app/api/webhooks/zoom
  ```
- **Add Event Types:**
  - `recording.transcript_completed`
  - `recording.transcript_file_completed`
  - (Any real-time transcription events available)

5. **Click "Save"** for each section

---

### Step 8: Test in Zoom

1. **Open Zoom desktop client**
2. **Start a test meeting**
3. **Click "Apps" button** at the bottom
4. **Search for "Sidekick"** (or your app name)
5. **Click to open the app**

**What you should see:**
- Sidekick sidebar opens on the right
- 5 template buttons (Discovery Call, Product Demo, etc.)
- Clean purple gradient UI
- No white screen!

**Test creating a checklist:**
1. Click on "Discovery Call" template
2. You should see 9 checklist items appear
3. Items should have checkboxes
4. You should be able to check them manually

---

## 🐛 Troubleshooting

### Issue: Backend still returns 403

**Solution:**
1. Check Vercel backend deployment logs:
   - Dashboard → Backend Project → Deployments → Latest → "Function Logs"
2. Verify all environment variables are set (especially `DATABASE_URL`)
3. Try manual redeploy:
   - Deployments → Latest → "..." → Redeploy

### Issue: Backend returns empty array for templates

**Solution:**
1. Database not seeded properly
2. Go back to Step 1 and run the SQL script again in Supabase
3. Verify in Supabase Table Editor that templates table has 5 rows

### Issue: Frontend shows white screen

**Check these:**
1. Is `VITE_BACKEND_URL` set in Vercel frontend env vars?
2. Did you redeploy frontend after setting env var?
3. Open browser console (F12) and check for errors
4. Check Network tab - is it calling the correct backend URL?

### Issue: CORS errors in browser console

**Solution:**
1. Check `FRONTEND_URL` is set correctly in backend env vars
2. Make sure it matches exactly: `https://side-kick-frontend-mauve.vercel.app`
3. No trailing slash!
4. Redeploy backend after fixing

### Issue: Database connection errors in Vercel logs

**Check:**
1. Are you using the **pooler** connection string (port 6543)?
2. Is the password URL-encoded (`%40` instead of `@`)?
3. Is your Supabase database paused? (Go to Supabase dashboard to check)

---

## 📦 Quick Reference

### Your URLs

**Frontend:** `https://side-kick-frontend-mauve.vercel.app`
**Backend:** `https://side-kick-backend-7spbdqe3b-soorajs-projects-7db04cce.vercel.app`
**Database:** Supabase project `uphayungnrbpgxpqjuyl`

### Backend Environment Variables
```
DATABASE_URL=postgresql://postgres.[ref]:Soorajk%40002@...pooler.supabase.com:6543/postgres
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview
ZOOM_CLIENT_ID=...
ZOOM_CLIENT_SECRET=...
ZOOM_WEBHOOK_SECRET_TOKEN=...
ZOOM_REDIRECT_URI=https://side-kick-frontend-mauve.vercel.app/auth/zoom/callback
JWT_SECRET=b8d9f2e1c4a7b6d5e8f3a2c9d6b4e7f1a5c8b3d6e9f2a5c8b1d4e7f0a3c6b9d2
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://side-kick-frontend-mauve.vercel.app
NODE_ENV=production
```

### Frontend Environment Variables
```
VITE_BACKEND_URL=https://side-kick-backend-7spbdqe3b-soorajs-projects-7db04cce.vercel.app
```

---

## ✅ Success Checklist

- [ ] Database created in Supabase (5 tables)
- [ ] 5 templates seeded in database
- [ ] Backend environment variables set in Vercel
- [ ] Backend redeployed (automatic after saving env vars)
- [ ] Backend health check returns `{"status":"ok"}`
- [ ] Backend templates API returns array of 5 templates
- [ ] Frontend environment variable set in Vercel
- [ ] Frontend manually redeployed
- [ ] Frontend loads without white screen
- [ ] Zoom app URLs configured
- [ ] Zoom webhook endpoint configured
- [ ] Sidekick opens in Zoom meeting
- [ ] Templates appear in Sidekick UI
- [ ] Can create checklist from template

---

## 🎉 Next Steps After Everything Works

Once you've verified everything above works:

1. **Get your OpenAI API key** (if you haven't already):
   - Visit: https://platform.openai.com/api-keys
   - Create new key
   - Add to backend env vars as `OPENAI_API_KEY`
   - Redeploy backend

2. **Set up Zoom OAuth** (for full integration):
   - Get Client ID and Secret from Zoom Marketplace
   - Add to backend env vars
   - Redeploy backend

3. **Test AI auto-checking**:
   - Start a Zoom meeting with transcription enabled
   - Create a checklist from Discovery Call template
   - Start having a conversation
   - Watch as AI auto-checks items based on what you say!

---

## 💬 Still Having Issues?

If you're stuck after following all steps:

1. **Check Vercel deployment logs:**
   - Backend: Dashboard → Backend Project → Deployments → Latest → "Function Logs"
   - Frontend: Dashboard → Frontend Project → Deployments → Latest → "Build Logs"

2. **Verify database connection:**
   - Supabase Dashboard → Project Settings → Database → Connection Pooling
   - Test connection with the pooler URL

3. **Check browser console:**
   - Open app in browser
   - Press F12 → Console tab
   - Look for specific error messages

4. **Share the specific error message** and I'll help debug further!

---

**The fixes are already pushed to your branch. Follow the steps above to complete the deployment!** 🚀
