# 🚀 Deploy SideKick to Vercel - Step by Step

Follow these steps to deploy SideKick to production in ~30 minutes.

## ✅ Pre-Deployment Checklist

### 1. Get Your API Keys (15 minutes)

#### Zoom Credentials
1. Go to [marketplace.zoom.us](https://marketplace.zoom.us)
2. Click **"Develop"** → **"Build App"**
3. Choose **"Zoom Apps"** (not Meeting SDK)
4. Fill in app details:
   - **App Name**: SideKick
   - **Short Description**: AI-powered sales playbook tracker
   - **Company Name**: Your company
5. After creation, go to **"App Credentials"** tab
   - Copy **Client ID** → Save it
   - Copy **Client Secret** → Save it
6. Go to **"Features"** tab → **"Event Subscriptions"**
   - Enable event subscriptions
   - Copy **Secret Token** → Save it
   - (We'll add webhook URL after backend deployment)

#### OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Click your profile → **"API Keys"**
4. Click **"Create new secret key"**
5. Name it "SideKick Production"
6. Copy the key (starts with `sk-`) → Save it
7. Add $10-20 credit to your account (Settings → Billing)

#### JWT Secret
Generate a random secret:
```bash
# Mac/Linux
openssl rand -base64 32

# Or use this online tool
# https://generate-secret.vercel.app/32
```
Copy the result → Save it

---

## 🔧 Step 1: Deploy Backend to Railway (Recommended)

Railway is better than Vercel for WebSocket and long-running processes.

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway

### 1.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your **SideKick** repository
4. Click **"Deploy Now"**

### 1.3 Add PostgreSQL Database
1. In your project, click **"New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Database will be created automatically
4. Click on the database service
5. Go to **"Variables"** tab
6. Copy the `DATABASE_URL` value

### 1.4 Configure Backend Service
1. Click on your backend service (not the database)
2. Go to **"Settings"** tab
3. Scroll to **"Root Directory"**
4. Set it to: `backend`
5. Click **"Update"**

### 1.5 Add Environment Variables
1. Stay in your backend service
2. Go to **"Variables"** tab
3. Click **"New Variable"** and add each of these:

```bash
# Zoom Configuration
ZOOM_CLIENT_ID=paste_your_zoom_client_id_here
ZOOM_CLIENT_SECRET=paste_your_zoom_client_secret_here
ZOOM_REDIRECT_URI=https://your-app.vercel.app/auth/zoom/callback
ZOOM_WEBHOOK_SECRET_TOKEN=paste_your_zoom_webhook_secret_here

# OpenAI Configuration
OPENAI_API_KEY=paste_your_openai_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# Database Configuration (use Railway's reference)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Server Configuration
NODE_ENV=production
BACKEND_PORT=8080
BACKEND_URL=https://your-backend.up.railway.app
FRONTEND_URL=https://your-app.vercel.app

# JWT Configuration
JWT_SECRET=paste_your_generated_jwt_secret_here
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
```

**Note**: Leave `BACKEND_URL` and `FRONTEND_URL` as placeholders for now. We'll update them after deployment.

### 1.6 Generate Domain
1. Go to **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. Copy your Railway URL: `https://sidekick-production.up.railway.app`
5. Go back to **"Variables"** tab
6. Update `BACKEND_URL` with your Railway URL

### 1.7 Deploy and Test
1. Railway will auto-deploy
2. Wait for deployment to complete (2-3 minutes)
3. Check logs in **"Deployments"** tab
4. Test your backend:
```bash
curl https://your-backend.up.railway.app/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

## 🎨 Step 2: Deploy Frontend to Vercel

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Login to Vercel
```bash
vercel login
```
- Choose your preferred login method
- Complete authentication

### 2.3 Deploy Frontend
```bash
cd frontend

# First deployment (creates project)
vercel

# Answer the prompts:
# - Link to existing project? N
# - Project name? sidekick
# - Directory? ./ (or leave blank)
# - Override settings? N

# Deploy to production
vercel --prod
```

### 2.4 Add Environment Variables
```bash
# Add backend URL
vercel env add VITE_BACKEND_URL production

# When prompted, paste your Railway backend URL:
# https://your-backend.up.railway.app
```

### 2.5 Redeploy with Environment Variables
```bash
vercel --prod
```

### 2.6 Get Your Frontend URL
After deployment, Vercel will show:
```
✅ Production: https://sidekick-xxx.vercel.app
```
Copy this URL!

---

## 🔄 Step 3: Update URLs in Backend

### 3.1 Update Railway Variables
1. Go back to Railway dashboard
2. Click on your backend service
3. Go to **"Variables"** tab
4. Update these variables with your actual Vercel URL:
   ```
   FRONTEND_URL=https://sidekick-xxx.vercel.app
   ZOOM_REDIRECT_URI=https://sidekick-xxx.vercel.app/auth/zoom/callback
   ```
5. Railway will auto-redeploy

---

## 🗄️ Step 4: Initialize Database

### 4.1 Install Dependencies Locally
```bash
cd backend
npm install
```

### 4.2 Set Up Database Schema
```bash
# Pull environment variables from Railway
# (or manually set DATABASE_URL in your terminal)
export DATABASE_URL="your_railway_postgres_url"

# Push database schema
npm run db:push

# Seed with default templates
npm run db:seed
```

### 4.3 Verify Database
Check Railway logs to confirm tables were created successfully.

---

## 📱 Step 5: Configure Zoom App

### 5.1 Update Zoom App URLs
1. Go to [marketplace.zoom.us](https://marketplace.zoom.us)
2. Click **"Manage"** → Find your app → **"View"**
3. Go to **"Basic Information"** tab
   - **Home URL**: `https://sidekick-xxx.vercel.app`
4. Go to **"Features"** tab
   - **Redirect URL for OAuth**: `https://sidekick-xxx.vercel.app/auth/zoom/callback`
5. Go to **"Event Subscriptions"**
   - **Event notification endpoint URL**: `https://your-backend.up.railway.app/api/webhooks/zoom`
   - Click **"Validate"** to verify
   - Subscribe to these events:
     - `meeting.transcription_message`
     - `meeting.transcription_completed`

### 5.2 Add App Scopes
Go to **"Scopes"** tab and add:
- `meeting:write`
- `meeting:read`
- `user:read`

### 5.3 Activate App
1. Go to **"Activation"** tab
2. For development: **"Add"** to your account
3. For production: Submit for review

---

## ✅ Step 6: Test Your Deployment

### 6.1 Test Backend
```bash
# Health check
curl https://your-backend.up.railway.app/health

# Get templates
curl https://your-backend.up.railway.app/api/templates
```

### 6.2 Test Frontend
1. Open your Vercel URL in browser
2. Should see loading screen or connection error (expected without Zoom)

### 6.3 Test in Zoom
1. Open Zoom desktop client
2. Start or join a meeting
3. Click **"Apps"** button in meeting controls
4. Search for your app or click **"Manage Apps"**
5. Add your app and open it
6. Should see SideKick interface!

---

## 🎉 You're Live!

Your deployment URLs:
- **Frontend**: `https://sidekick-xxx.vercel.app`
- **Backend**: `https://your-backend.up.railway.app`
- **Database**: Railway PostgreSQL

### Quick Links
- **Railway Dashboard**: [railway.app](https://railway.app)
- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Zoom App**: [marketplace.zoom.us/manage](https://marketplace.zoom.us/manage)

---

## 🐛 Troubleshooting

### Backend Issues

**Deployment fails:**
- Check Railway logs in "Deployments" tab
- Verify all environment variables are set
- Ensure `backend` is set as root directory

**Database connection error:**
- Verify `DATABASE_URL` uses `${{Postgres.DATABASE_URL}}`
- Check PostgreSQL service is running
- Ensure database is in same project

**Health check fails:**
- Check Railway deployment logs
- Verify domain is generated
- Wait a few minutes for DNS propagation

### Frontend Issues

**App won't load:**
- Check `VITE_BACKEND_URL` is set correctly in Vercel
- Verify backend is deployed and healthy
- Check browser console for errors

**CORS errors:**
- Verify `FRONTEND_URL` is set correctly in backend
- Check backend CORS configuration
- Ensure URLs match exactly (no trailing slash)

### Zoom Issues

**App not appearing in Zoom:**
- Verify app is activated in Zoom Marketplace
- Check Home URL is correct
- Try restarting Zoom client

**Webhook validation fails:**
- Verify webhook URL is correct
- Check `ZOOM_WEBHOOK_SECRET_TOKEN` is set
- View Railway logs for webhook requests

---

## 📊 Monitor Your Deployment

### Railway Logs
```
Railway Dashboard → Your Service → Deployments → View Logs
```

### Vercel Logs
```
Vercel Dashboard → Your Project → Deployments → View Function Logs
```

---

## 💰 Costs

**Current setup:**
- Railway Starter: **$5/month** (includes PostgreSQL)
- Vercel Hobby: **Free** (or Pro $20/month for commercial)
- OpenAI: **Pay-per-use** (~$0.01-0.03 per conversation)

**Estimated total**: **$5-30/month** depending on usage

---

## 🚀 Next Steps

1. ✅ Test with real sales calls
2. ✅ Customize templates for your team
3. ✅ Invite team members to try it
4. ✅ Monitor OpenAI usage and costs
5. ✅ Set up custom domain (optional)
6. ✅ Enable analytics (future feature)

---

## 📞 Need Help?

- **Documentation**: See `docs/VERCEL_DEPLOYMENT.md`
- **Environment Setup**: See `docs/ENV_SETUP.md`
- **Issues**: Create a GitHub issue with deployment logs

---

**Congratulations! SideKick is now live! 🎉🚀**

Share your deployed URL and start using AI-powered sales checklists in your Zoom calls!
