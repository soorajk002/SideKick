# Environment Variables Explained

## Required vs Optional Variables

Here's a clear breakdown of all environment variables for SideKick:

---

## ✅ REQUIRED Variables

### 1. **OPENAI_API_KEY** ⭐ REQUIRED
**What it is:** Your OpenAI API key for GPT-4 AI analysis

**Where to get it:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Click your profile → **"API Keys"**
4. Click **"Create new secret key"**
5. Copy the key (starts with `sk-`)

**Example:**
```bash
OPENAI_API_KEY=sk-proj-abc123xyz789...
```

---

### 2. **OPENAI_MODEL** ⚙️ REQUIRED (but just type it)
**What it is:** The name of the OpenAI model to use

**Where to get it:** You don't "get" it - just type the value!

**Recommended value:**
```bash
OPENAI_MODEL=gpt-4-turbo-preview
```

**Other options:**
- `gpt-4-turbo-preview` - Best quality (recommended)
- `gpt-4` - Stable version
- `gpt-3.5-turbo` - Faster, cheaper (less accurate)

**Cost comparison:**
- GPT-4 Turbo: ~$0.01-0.03 per conversation analysis
- GPT-3.5 Turbo: ~$0.002 per conversation analysis

**For SideKick, use:** `gpt-4-turbo-preview`

---

### 3. **ZOOM_CLIENT_ID** ⭐ REQUIRED
**What it is:** Your Zoom app's client ID

**Where to get it:**
1. Go to [marketplace.zoom.us](https://marketplace.zoom.us)
2. Click **"Develop"** → **"Build App"**
3. Create **"Zoom Apps"** (not OAuth)
4. Go to **"App Credentials"** tab
5. Copy **"Client ID"**

**Example:**
```bash
ZOOM_CLIENT_ID=abc123XYZ
```

---

### 4. **ZOOM_CLIENT_SECRET** ⭐ REQUIRED
**What it is:** Your Zoom app's client secret

**Where to get it:**
1. Same place as Client ID
2. Go to **"App Credentials"** tab
3. Copy **"Client Secret"**

**Example:**
```bash
ZOOM_CLIENT_SECRET=secret123abc
```

---

### 5. **ZOOM_WEBHOOK_SECRET_TOKEN** ⭐ REQUIRED
**What it is:** Secret token to verify Zoom webhook requests

**Where to get it:**
1. In your Zoom app settings
2. Go to **"Features"** tab
3. Click **"Event Subscriptions"**
4. Enable event subscriptions
5. Copy **"Secret Token"**

**Example:**
```bash
ZOOM_WEBHOOK_SECRET_TOKEN=webhook_secret_abc123
```

---

## ⚠️ SEMI-REQUIRED Variables

### 6. **ZOOM_REDIRECT_URI** ⚙️ NOT REQUIRED for Zoom Apps SDK

**What it is:** OAuth callback URL (used for traditional OAuth apps)

**Do you need it?**
- ❌ **Not required** if using Zoom Apps SDK (which we are!)
- ✅ **Required** only for OAuth/Server-to-Server apps

**For SideKick:** We're using Zoom Apps SDK, so this is **optional**

**However, if you want to set it anyway:**
```bash
# Local development
ZOOM_REDIRECT_URI=http://localhost:3000/auth/zoom/callback

# Production
ZOOM_REDIRECT_URI=https://your-app.vercel.app/auth/zoom/callback
```

**Note:** Some Zoom app configurations ask for this even if not used. Safe to include.

---

## 🔧 Other Configuration Variables

### 7. **DATABASE_URL** ⭐ REQUIRED
**What it is:** PostgreSQL database connection string

**Where to get it:**

**Option A: Supabase (Recommended)**
1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings → Database
3. Copy connection string (URI format)

**Example:**
```bash
DATABASE_URL=postgresql://postgres.abc:password@db.xxx.supabase.co:6543/postgres
```

**Option B: Local PostgreSQL**
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/sidekick
```

---

### 8. **JWT_SECRET** ⭐ REQUIRED
**What it is:** Secret key for signing JWT tokens

**Where to get it:** Generate it yourself!

```bash
openssl rand -base64 32
```

**Example:**
```bash
JWT_SECRET=Hj6hdiurByDTwkIyu4fZWyGsQG0obfAyXCmpk3RzwsM=
```

---

### 9. **JWT_EXPIRES_IN** ⚙️ OPTIONAL (default provided)
**What it is:** How long JWT tokens are valid

**Just type this value:**
```bash
JWT_EXPIRES_IN=7d
```

Other options: `1d`, `12h`, `30d`

---

## 🌐 URL Configuration (Auto-Generated)

These depend on where you deploy:

### 10. **BACKEND_URL**
```bash
# Local
BACKEND_URL=http://localhost:8080

# Production (Railway)
BACKEND_URL=https://your-app.up.railway.app

# Production (Vercel)
BACKEND_URL=https://your-backend.vercel.app
```

### 11. **FRONTEND_URL**
```bash
# Local
FRONTEND_URL=http://localhost:3000

# Production (Vercel)
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🎯 Quick Copy Templates

### Local Development (.env)
```bash
# OpenAI (REQUIRED)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Zoom (REQUIRED)
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_WEBHOOK_SECRET_TOKEN=your_webhook_secret
ZOOM_REDIRECT_URI=http://localhost:3000/auth/zoom/callback

# Database (REQUIRED)
DATABASE_URL=postgresql://postgres:password@localhost:5432/sidekick

# JWT (REQUIRED)
JWT_SECRET=Hj6hdiurByDTwkIyu4fZWyGsQG0obfAyXCmpk3RzwsM=
JWT_EXPIRES_IN=7d

# Server Config
NODE_ENV=development
BACKEND_PORT=8080
FRONTEND_PORT=3000
BACKEND_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug
```

### Production (.env.production)
```bash
# OpenAI (REQUIRED)
OPENAI_API_KEY=sk-your-production-key
OPENAI_MODEL=gpt-4-turbo-preview

# Zoom (REQUIRED)
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
ZOOM_WEBHOOK_SECRET_TOKEN=your_webhook_secret
ZOOM_REDIRECT_URI=https://your-app.vercel.app/auth/zoom/callback

# Database (REQUIRED - Supabase)
DATABASE_URL=postgresql://postgres.xxx:password@db.xxx.supabase.co:6543/postgres

# JWT (REQUIRED - Different from dev!)
JWT_SECRET=production-secret-generate-new-one
JWT_EXPIRES_IN=7d

# Server Config (URLs from deployment)
NODE_ENV=production
BACKEND_PORT=8080
BACKEND_URL=https://your-backend.up.railway.app
FRONTEND_URL=https://your-app.vercel.app
LOG_LEVEL=info
```

---

## 📋 Complete Checklist

### Getting Your Credentials:

**OpenAI:**
- [ ] Create OpenAI account
- [ ] Add $10-20 credit
- [ ] Generate API key
- [ ] Copy key (starts with `sk-`)
- [ ] Set OPENAI_MODEL to `gpt-4-turbo-preview`

**Zoom:**
- [ ] Create Zoom Marketplace account
- [ ] Create new "Zoom Apps" app
- [ ] Get Client ID from App Credentials
- [ ] Get Client Secret from App Credentials
- [ ] Enable Event Subscriptions in Features
- [ ] Get Webhook Secret Token
- [ ] (Optional) Set Redirect URI

**Database:**
- [ ] Choose: Supabase, Railway, or Local
- [ ] Create database
- [ ] Get connection string
- [ ] Add to DATABASE_URL

**Security:**
- [ ] Generate JWT_SECRET: `openssl rand -base64 32`
- [ ] Set JWT_EXPIRES_IN to `7d`

**Deployment URLs:**
- [ ] Deploy backend, get URL
- [ ] Deploy frontend, get URL
- [ ] Update BACKEND_URL and FRONTEND_URL

---

## 💡 Pro Tips

1. **OPENAI_MODEL** - Start with `gpt-4-turbo-preview`. If too expensive, switch to `gpt-3.5-turbo`

2. **ZOOM_REDIRECT_URI** - Safe to include even if not needed. Use your frontend URL + `/auth/zoom/callback`

3. **Use different secrets for dev vs prod** - Never use the same JWT_SECRET in development and production

4. **Keep a backup** - Store all production credentials in a password manager

---

## ❓ Still Confused?

**Question:** "Where do I get OPENAI_MODEL?"
**Answer:** You don't get it anywhere - just type `gpt-4-turbo-preview`

**Question:** "Is ZOOM_REDIRECT_URI required?"
**Answer:** Not for Zoom Apps SDK (which we use), but safe to include anyway

**Question:** "Which model should I use?"
**Answer:** `gpt-4-turbo-preview` for best results, `gpt-3.5-turbo` for lower cost

---

## 🎯 Summary

**Just type these values directly:**
- `OPENAI_MODEL=gpt-4-turbo-preview` ← Just type this!
- `JWT_EXPIRES_IN=7d` ← Just type this!
- `LOG_LEVEL=debug` ← Just type this!

**Get from external services:**
- `OPENAI_API_KEY` → platform.openai.com
- `ZOOM_CLIENT_ID` → marketplace.zoom.us
- `ZOOM_CLIENT_SECRET` → marketplace.zoom.us
- `ZOOM_WEBHOOK_SECRET_TOKEN` → marketplace.zoom.us
- `DATABASE_URL` → supabase.com or your database provider

**Generate yourself:**
- `JWT_SECRET` → `openssl rand -base64 32`

**URLs (from your deployment):**
- `BACKEND_URL` → Your Railway/Vercel backend URL
- `FRONTEND_URL` → Your Vercel frontend URL
- `ZOOM_REDIRECT_URI` → Your frontend URL + `/auth/zoom/callback`

---

Ready to set up? Start with the checklist above! 🚀
