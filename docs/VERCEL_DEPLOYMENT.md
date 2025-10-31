# Vercel Deployment Guide for SideKick

This guide will walk you through deploying SideKick to Vercel.

## Prerequisites

1. **Vercel Account** - [Sign up](https://vercel.com/signup)
2. **GitHub Repository** - Push your code to GitHub
3. **API Keys Ready**:
   - Zoom Client ID & Secret
   - OpenAI API Key
   - Database URL (Vercel Postgres or external)

## Option 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Deploy Frontend

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"

2. **Import Your Repository**
   - Select your GitHub repository
   - Choose `frontend` folder as root directory
   - Framework: Vite
   - Click "Import"

3. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables**
   - Go to "Environment Variables" section
   - Add: `VITE_BACKEND_URL` (leave empty for now, we'll update after backend deployment)
   - Click "Deploy"

5. **Get Frontend URL**
   - After deployment, note your URL: `https://sidekick-xxx.vercel.app`

### Step 2: Deploy Backend

#### Option A: Vercel (Serverless)

1. **Create New Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository again
   - Choose `backend` folder as root directory

2. **Configure Build Settings**
   ```
   Framework Preset: Other
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Add Environment Variables**
   Copy these from your `.env` file:
   ```
   ZOOM_CLIENT_ID=your_zoom_client_id
   ZOOM_CLIENT_SECRET=your_zoom_client_secret
   ZOOM_REDIRECT_URI=https://your-frontend.vercel.app/auth/zoom/callback
   ZOOM_WEBHOOK_SECRET_TOKEN=your_webhook_secret

   OPENAI_API_KEY=your_openai_key
   OPENAI_MODEL=gpt-4-turbo-preview

   DATABASE_URL=your_database_url

   NODE_ENV=production
   BACKEND_URL=https://your-backend.vercel.app
   FRONTEND_URL=https://your-frontend.vercel.app

   JWT_SECRET=your_random_32_char_secret
   JWT_EXPIRES_IN=7d

   LOG_LEVEL=info
   ```

4. **Deploy**
   - Click "Deploy"
   - Note your backend URL: `https://sidekick-backend-xxx.vercel.app`

#### Option B: Railway (Recommended for Backend)

Railway is better for WebSocket support and long-running processes.

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select `backend` folder

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Copy the `DATABASE_URL` connection string

4. **Set Environment Variables**
   - Go to your backend service
   - Click "Variables"
   - Add all variables from `.env.production`
   - Use `${{Postgres.DATABASE_URL}}` for database connection

5. **Deploy**
   - Railway auto-deploys on push
   - Get your URL: Settings → Generate Domain

### Step 3: Set up Database

#### Using Vercel Postgres

1. **Create Database**
   - In Vercel Dashboard, go to Storage
   - Click "Create Database"
   - Choose "Postgres"
   - Select your region
   - Click "Create"

2. **Connect to Backend**
   - Copy the `POSTGRES_URL` connection string
   - Add it to backend environment variables as `DATABASE_URL`

3. **Run Migrations**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Link project
   cd backend
   vercel link

   # Run migrations
   vercel env pull
   npm run db:push
   npm run db:seed
   ```

#### Using External Database (Supabase/Neon)

1. **Create Database on Supabase**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy connection string

2. **Add to Environment Variables**
   - Use the connection string as `DATABASE_URL`

### Step 4: Update Frontend Backend URL

1. **Go to Frontend Project in Vercel**
2. **Settings** → **Environment Variables**
3. **Update** `VITE_BACKEND_URL`:
   ```
   VITE_BACKEND_URL=https://your-backend.vercel.app
   ```
   or if using Railway:
   ```
   VITE_BACKEND_URL=https://your-app.up.railway.app
   ```
4. **Redeploy** frontend

### Step 5: Configure Zoom App

1. **Go to Zoom Marketplace**
   - Visit [marketplace.zoom.us](https://marketplace.zoom.us)
   - Go to your app settings

2. **Update URLs**
   ```
   Home URL: https://your-frontend.vercel.app
   Redirect URL: https://your-frontend.vercel.app/auth/zoom/callback
   Webhook URL: https://your-backend.vercel.app/api/webhooks/zoom
   ```

3. **Save Changes**

## Option 2: Deploy via Vercel CLI

### Install Vercel CLI

```bash
npm install -g vercel
vercel login
```

### Deploy Frontend

```bash
cd frontend

# Link to Vercel project (first time)
vercel link

# Add environment variables
vercel env add VITE_BACKEND_URL production

# Deploy to production
vercel --prod
```

### Deploy Backend

```bash
cd backend

# Link to Vercel project
vercel link

# Add all environment variables
vercel env add ZOOM_CLIENT_ID production
vercel env add ZOOM_CLIENT_SECRET production
vercel env add OPENAI_API_KEY production
vercel env add DATABASE_URL production
# ... add all other variables

# Deploy to production
vercel --prod
```

## Environment Variables Checklist

### Frontend (.env.production)
- [ ] `VITE_BACKEND_URL` - Your backend URL

### Backend (.env.production)
- [ ] `ZOOM_CLIENT_ID` - From Zoom Marketplace
- [ ] `ZOOM_CLIENT_SECRET` - From Zoom Marketplace
- [ ] `ZOOM_REDIRECT_URI` - Your frontend URL + /auth/zoom/callback
- [ ] `ZOOM_WEBHOOK_SECRET_TOKEN` - From Zoom Marketplace
- [ ] `OPENAI_API_KEY` - From OpenAI Platform
- [ ] `OPENAI_MODEL` - gpt-4-turbo-preview
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NODE_ENV` - production
- [ ] `BACKEND_URL` - Your backend URL
- [ ] `FRONTEND_URL` - Your frontend URL
- [ ] `JWT_SECRET` - Random 32+ character string
- [ ] `JWT_EXPIRES_IN` - 7d
- [ ] `LOG_LEVEL` - info

## Post-Deployment Steps

### 1. Test the Deployment

```bash
# Test backend health
curl https://your-backend.vercel.app/health

# Should return: {"status":"ok","timestamp":"..."}
```

### 2. Initialize Database

```bash
# Using Vercel CLI
cd backend
vercel env pull
npm run db:push
npm run db:seed
```

### 3. Test in Zoom

1. Open Zoom desktop client
2. Start or join a meeting
3. Click "Apps" button
4. Search for your app or use dev URL
5. Verify app loads correctly

### 4. Monitor Logs

**Vercel Dashboard:**
- Go to your project
- Click "Deployments"
- Click on latest deployment
- View "Runtime Logs"

**Railway Dashboard:**
- Go to your project
- Click on service
- View "Deployments" tab
- Click "View Logs"

## Troubleshooting

### Frontend Issues

**App won't load:**
- Check `VITE_BACKEND_URL` is set correctly
- Verify CORS settings in backend
- Check browser console for errors

**Build fails:**
```bash
# Clear cache and rebuild
vercel --force
```

### Backend Issues

**Database connection fails:**
- Verify `DATABASE_URL` is correct
- Check database allows connections from Vercel IPs
- Try using connection pooling

**WebSocket not working:**
- Vercel has limitations with WebSockets
- Consider using Railway for backend
- Or use Vercel with Pusher/Ably for real-time

**API timeout:**
- Vercel serverless functions timeout at 60s (Pro) or 10s (Hobby)
- Optimize OpenAI calls
- Consider Railway for longer timeouts

### Environment Variable Issues

**Variables not updating:**
```bash
# Redeploy after changing env vars
vercel --prod --force
```

**Check current variables:**
```bash
vercel env ls
```

## Performance Optimization

### 1. Enable Edge Functions (Vercel)

Update `vercel.json`:
```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "edge"
    }
  }
}
```

### 2. Add Caching Headers

```typescript
// In your API routes
res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
```

### 3. Use Environment-specific Builds

```json
{
  "scripts": {
    "build:production": "NODE_ENV=production npm run build"
  }
}
```

## Cost Estimates

### Vercel (Hobby Plan - Free)
- ✓ Frontend hosting
- ✓ Automatic deployments
- ✓ SSL certificates
- ✗ Limited serverless execution time
- ✗ No commercial use

### Vercel (Pro Plan - $20/month)
- ✓ Longer serverless execution (60s)
- ✓ Commercial use
- ✓ Better performance
- ✓ Team collaboration

### Railway (Starter - $5/month)
- ✓ Always-on backend
- ✓ PostgreSQL included
- ✓ WebSocket support
- ✓ Better for real-time apps

### Recommended Setup
- **Frontend**: Vercel (Free or Pro)
- **Backend**: Railway ($5/mo)
- **Database**: Railway PostgreSQL (included)
- **Total**: $5-25/month

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ✅ Deploy backend to Railway
3. ✅ Set up database
4. ✅ Configure environment variables
5. ✅ Update Zoom app settings
6. ✅ Test in production
7. 🚀 Start using SideKick!

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Issues**: Create a GitHub issue with deployment logs

---

**Congratulations! SideKick is now live! 🎉**
