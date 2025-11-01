# Web Dashboard Deployment Guide

## Access Your Dashboard

The web dashboard (signup, login, analytics) is separate from the Zoom app.

**Current Status:**
- ✅ Zoom App: https://side-kick-frontend-mauve.vercel.app/ (works inside Zoom only)
- ❌ Web Dashboard: NOT DEPLOYED YET

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy the web dashboard:**
   ```bash
   cd web
   vercel
   ```

3. **Configure Environment Variables** in Vercel dashboard:
   - Go to your project settings → Environment Variables
   - Add the required variables (see below)

4. **Redeploy after adding env vars:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel GitHub Integration

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. **IMPORTANT:** Set **Root Directory** to `web`
4. Configure environment variables
5. Deploy

## Required Environment Variables

### Essential (Minimum to test):

```env
# Database (Supabase recommended)
DATABASE_URL=postgresql://user:password@host:5432/database

# NextAuth.js (generate random secret)
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-here

# OpenAI (for AI features)
OPENAI_API_KEY=sk-your-openai-api-key

# App URLs
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

### Optional (Add later):

```env
# OAuth Providers (optional - can use email/password first)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=

# Stripe (for billing - not implemented yet)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=

# Email (for notifications - not implemented yet)
RESEND_API_KEY=
FROM_EMAIL=
```

## Setup Steps

### 1. Create Database (Supabase - Free Tier)

1. Go to https://supabase.com
2. Create new project
3. Copy the PostgreSQL connection string
4. Run the database migrations:
   ```bash
   cd web
   npm install
   npm run db:push
   ```

### 2. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### 3. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy and save it

### 4. Deploy!

```bash
cd web
vercel --prod
```

## Testing Locally First

If you want to test locally before deploying:

1. **Copy environment file:**
   ```bash
   cd web
   cp .env.example .env
   ```

2. **Fill in the values in `.env`**

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run database migrations:**
   ```bash
   npm run db:push
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

6. **Open browser:**
   ```
   http://localhost:3001
   ```

## What You'll See

Once deployed, you'll have access to:

- **Landing Page** - Marketing page with features and pricing
- **Signup/Login** - Email/password authentication
- **Dashboard** - Main dashboard with meeting stats
- **Templates** - Manage sales playbook templates
- **Meetings** - View past meetings and AI analysis
- **Analytics** - Performance metrics and insights
- **Team** - Team member management
- **Settings** - Profile, billing, integrations

## Architecture

```
┌─────────────────────┐
│   Web Dashboard     │ ← You want to access this
│  (Next.js + Auth)   │    (signup, login, analytics)
│   localhost:3001    │
└─────────────────────┘
           │
           ├── Uses API ────────┐
           │                     │
           │              ┌──────▼───────┐
           │              │   Backend    │
           │              │  (Express)   │
           │              │  port 8080   │
           │              └──────────────┘
           │
    ┌──────▼───────────┐
    │   Zoom App       │ ← Already deployed
    │  (Vite + React)  │    (works inside Zoom)
    │   Zoom Sidebar   │
    └──────────────────┘
```

## Next Steps After Deployment

1. Test signup/login
2. Create your first template
3. Test the Zoom app with real meetings
4. Invite team members
5. Review analytics

## Troubleshooting

**"Internal Server Error" on deployed site:**
- Check environment variables are set correctly
- Verify DATABASE_URL is accessible
- Check Vercel logs: `vercel logs`

**"Database connection failed":**
- Ensure Supabase database is running
- Check DATABASE_URL format
- Run migrations: `npm run db:push`

**Can't login:**
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your deployment URL
- Clear browser cookies and try again
