# Quick Environment Setup Guide

## 🎯 What You Need

Before deploying, gather these credentials:

### 1. Zoom Credentials
- **Client ID**: From Zoom Marketplace → Your App → App Credentials
- **Client Secret**: From Zoom Marketplace → Your App → App Credentials
- **Webhook Secret**: From Zoom Marketplace → Your App → Features → Event Subscriptions

**How to get:**
1. Go to [marketplace.zoom.us](https://marketplace.zoom.us)
2. Click "Develop" → "Build App"
3. Create a "Zoom Apps" app
4. Go to "App Credentials" to find Client ID and Secret
5. Go to "Features" → "Event Subscriptions" for Webhook Secret

### 2. OpenAI API Key
- **API Key**: From OpenAI Platform

**How to get:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Click your profile → "API Keys"
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### 3. Database
- **Connection String**: From your database provider

**Options:**
- **Vercel Postgres**: Built into Vercel, easy setup
- **Supabase**: Generous free tier, great for development
- **Railway**: Included with Railway hosting

### 4. JWT Secret
- **Random String**: Any secure random string (32+ characters)

**Generate one:**
```bash
# On Mac/Linux
openssl rand -base64 32

# Or use this online
# https://generate-secret.vercel.app/32
```

## 📝 Environment Variables Template

### Frontend (.env)
```bash
VITE_BACKEND_URL=http://localhost:8080
```

### Backend (.env)
```bash
# Zoom
ZOOM_CLIENT_ID=your_client_id_here
ZOOM_CLIENT_SECRET=your_client_secret_here
ZOOM_REDIRECT_URI=http://localhost:3000/auth/zoom/callback
ZOOM_WEBHOOK_SECRET_TOKEN=your_webhook_secret_here

# OpenAI
OPENAI_API_KEY=sk-your_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sidekick

# Server
NODE_ENV=development
BACKEND_PORT=8080
FRONTEND_PORT=3000
BACKEND_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your_32_char_random_string_here
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=debug
```

## 🚀 Production Environment Variables

### Frontend (Vercel)
```bash
VITE_BACKEND_URL=https://your-backend.vercel.app
```

### Backend (Vercel/Railway)
```bash
# Zoom
ZOOM_CLIENT_ID=your_client_id
ZOOM_CLIENT_SECRET=your_client_secret
ZOOM_REDIRECT_URI=https://your-app.vercel.app/auth/zoom/callback
ZOOM_WEBHOOK_SECRET_TOKEN=your_webhook_secret

# OpenAI
OPENAI_API_KEY=sk-your_key
OPENAI_MODEL=gpt-4-turbo-preview

# Database (from your provider)
DATABASE_URL=postgresql://...

# Server
NODE_ENV=production
BACKEND_PORT=8080
BACKEND_URL=https://your-backend.vercel.app
FRONTEND_URL=https://your-app.vercel.app

# JWT
JWT_SECRET=production_secret_32_chars_min
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
```

## ✅ Setup Checklist

- [ ] Created Zoom App on Marketplace
- [ ] Got Zoom Client ID and Secret
- [ ] Got Zoom Webhook Secret Token
- [ ] Created OpenAI account
- [ ] Got OpenAI API Key
- [ ] Chosen database provider (Vercel/Supabase/Railway)
- [ ] Generated JWT secret
- [ ] Created `.env` files locally
- [ ] Tested app works locally
- [ ] Ready to deploy!

## 🔄 Adding Environment Variables to Vercel

### Via Dashboard:
1. Go to your project on Vercel
2. Click "Settings"
3. Click "Environment Variables"
4. Add each variable one by one
5. Select "Production" environment
6. Click "Save"

### Via CLI:
```bash
# Login to Vercel
vercel login

# Link project
vercel link

# Add variables
vercel env add VITE_BACKEND_URL production
vercel env add ZOOM_CLIENT_ID production
vercel env add OPENAI_API_KEY production
# ... etc
```

## 🔒 Security Best Practices

1. **Never commit .env files** - Already in .gitignore
2. **Use different secrets for dev/prod**
3. **Rotate keys periodically**
4. **Use environment-specific values**
5. **Keep backup of production variables** (in password manager)

## 📞 Need Help?

See detailed deployment guide: `docs/VERCEL_DEPLOYMENT.md`
