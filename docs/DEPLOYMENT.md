# Deployment Guide

This guide covers deploying SideKick to production.

## Deployment Options

### Recommended Stack

- **Frontend:** Vercel
- **Backend:** Railway or Render
- **Database:** Railway PostgreSQL or Supabase
- **Domain:** Custom domain with SSL

## Option 1: Vercel + Railway (Recommended)

### Deploy Backend to Railway

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Initialize project
   cd backend
   railway init
   ```

3. **Add PostgreSQL**
   - In Railway dashboard, click "New"
   - Select "Database" → "PostgreSQL"
   - Note the connection string

4. **Set Environment Variables**
   ```bash
   railway variables set ZOOM_CLIENT_ID=your_client_id
   railway variables set ZOOM_CLIENT_SECRET=your_client_secret
   railway variables set OPENAI_API_KEY=your_openai_key
   railway variables set DATABASE_URL=${{Postgres.DATABASE_URL}}
   # ... add all other env vars
   ```

5. **Deploy**
   ```bash
   railway up
   ```

6. **Run Migrations**
   ```bash
   railway run npm run db:push
   railway run npm run db:seed
   ```

7. **Get Backend URL**
   ```bash
   railway domain
   # Example: sidekick-backend.up.railway.app
   ```

### Deploy Frontend to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Configure Environment**
   Create `frontend/.env.production`:
   ```env
   VITE_BACKEND_URL=https://your-backend-url.railway.app
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Set Environment Variables in Vercel**
   - Go to Vercel dashboard
   - Select your project
   - Settings → Environment Variables
   - Add: `VITE_BACKEND_URL`

## Option 2: All-in-One (Render)

### Deploy to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - New → PostgreSQL
   - Note the internal and external connection strings

3. **Create Backend Web Service**
   - New → Web Service
   - Connect your repository
   - Configure:
     - Name: sidekick-backend
     - Environment: Node
     - Build Command: `cd backend && npm install && npm run build`
     - Start Command: `cd backend && npm start`
     - Add environment variables

4. **Create Frontend Static Site**
   - New → Static Site
   - Connect your repository
   - Configure:
     - Name: sidekick-frontend
     - Build Command: `cd frontend && npm install && npm run build`
     - Publish Directory: `frontend/dist`

## Production Environment Variables

### Backend

```env
# Zoom
ZOOM_CLIENT_ID=production_client_id
ZOOM_CLIENT_SECRET=production_client_secret
ZOOM_REDIRECT_URI=https://yourdomain.com/auth/zoom/callback
ZOOM_WEBHOOK_SECRET_TOKEN=production_webhook_secret

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# Database (from Railway/Render)
DATABASE_URL=postgresql://...

# Server
NODE_ENV=production
BACKEND_PORT=8080
BACKEND_URL=https://api.yourdomain.com
FRONTEND_URL=https://app.yourdomain.com

# Security
JWT_SECRET=very_strong_random_secret_min_32_chars
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
```

### Frontend

```env
VITE_BACKEND_URL=https://api.yourdomain.com
```

## Update Zoom App Configuration

### Production URLs

1. Go to Zoom App Marketplace
2. Edit your app
3. Update URLs:
   - **Home URL:** `https://app.yourdomain.com`
   - **Redirect URL:** `https://app.yourdomain.com/auth/zoom/callback`
   - **Webhook URL:** `https://api.yourdomain.com/api/webhooks/zoom`

4. **Activate App:**
   - Go to "Activation" tab
   - Submit for review or activate for account

## Custom Domain Setup

### Vercel Custom Domain

1. In Vercel dashboard → Domains
2. Add domain: `app.yourdomain.com`
3. Add DNS records as instructed

### Railway Custom Domain

1. In Railway project → Settings
2. Add domain: `api.yourdomain.com`
3. Add DNS records:
   ```
   Type: CNAME
   Name: api
   Value: your-project.up.railway.app
   ```

## SSL/TLS

Both Vercel and Railway provide automatic SSL certificates.

## Database Migrations

### Initial Setup

```bash
# Connect to production database
DATABASE_URL=your_production_url npm run db:push

# Seed data
DATABASE_URL=your_production_url npm run db:seed
```

### Future Migrations

```bash
# Generate migration
npm run db:generate

# Apply to production
DATABASE_URL=your_production_url npm run db:push
```

## Monitoring

### Logging

**Railway/Render:**
- Built-in log viewing in dashboard
- Export to external services (optional)

### Error Tracking

Add Sentry for error tracking:

```bash
npm install @sentry/node @sentry/react
```

Configure in backend and frontend.

### Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- Better Uptime

Monitor:
- Frontend: `https://app.yourdomain.com`
- Backend health: `https://api.yourdomain.com/health`

## Performance

### Frontend Optimization

1. **Build optimization** (done automatically)
   - Code splitting
   - Asset optimization
   - Minification

2. **CDN** (Vercel provides automatically)

### Backend Optimization

1. **Connection Pooling**
   Already configured in `backend/src/db/index.ts`

2. **Caching** (optional)
   ```bash
   npm install redis
   ```

## Scaling

### Horizontal Scaling

For higher load:

1. **Redis for State**
   - Add Redis database
   - Use for Socket.io adapter
   - Use for session storage

2. **Multiple Backend Instances**
   - Increase instances in Railway/Render
   - Load balancer (automatic)

### Database Scaling

- Connection pooling (already configured)
- Read replicas (if available)
- Regular maintenance

## Backup Strategy

### Database Backups

**Railway:**
- Automatic daily backups (included)
- Manual backups via CLI

**Render:**
- Automatic backups (paid plans)

### Manual Backup

```bash
pg_dump $DATABASE_URL > backup.sql
```

## Security Checklist

- [ ] All environment variables set correctly
- [ ] Strong JWT secret (32+ characters)
- [ ] Database connection encrypted
- [ ] Webhook signature verification enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Helmet.js security headers enabled
- [ ] SSL/TLS certificates active
- [ ] Logs not exposing sensitive data
- [ ] OpenAI API key secured

## CI/CD (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm i -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm i -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check environment variables
- Verify database connection
- Check logs for errors

**Zoom app not loading:**
- Verify Zoom app URLs
- Check CORS configuration
- Ensure app is activated

**WebSocket not connecting:**
- Check backend URL in frontend
- Verify CORS settings
- Check firewall/proxy settings

**AI not working:**
- Verify OpenAI API key
- Check API credits
- Review logs for errors

## Cost Estimation

### Monthly Costs (Approximate)

**Railway:**
- Hobby Plan: $5/month
- Pro Plan: $20/month

**Vercel:**
- Hobby: Free
- Pro: $20/month

**Supabase (alternative):**
- Free tier: $0
- Pro: $25/month

**OpenAI:**
- GPT-4 Turbo: ~$0.01-0.03 per request
- Estimate: $50-200/month depending on usage

**Total:** ~$30-250/month

## Support

For deployment issues:
- Check platform documentation
- Review application logs
- Test locally first
- Create GitHub issue with details
