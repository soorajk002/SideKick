# Quick Start Guide

Get SideKick running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running
- Zoom Developer account
- OpenAI API key

## 1. Install Dependencies

```bash
npm install
```

## 2. Setup Database

```bash
# Create database
createdb sidekick

# Setup schema
cd backend
npm run db:push
npm run db:seed
```

## 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your credentials
# Minimum required:
# - ZOOM_CLIENT_ID
# - ZOOM_CLIENT_SECRET
# - OPENAI_API_KEY
# - DATABASE_URL
```

## 4. Start Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## 5. Test in Zoom

For local development:

```bash
# Terminal 3: Expose with ngrok
ngrok http 3000
```

Update your Zoom App settings with the ngrok URL and open in Zoom!

## What's Next?

- Read the [Full Setup Guide](./docs/SETUP.md)
- Check out [Architecture Documentation](./docs/ARCHITECTURE.md)
- Review [Deployment Guide](./docs/DEPLOYMENT.md)

## Common Issues

**Database connection failed?**
```bash
# Check PostgreSQL is running
pg_isready
```

**Port already in use?**
```bash
# Change port in .env
BACKEND_PORT=8081
FRONTEND_PORT=3001
```

**Zoom SDK not loading?**
- Must run inside actual Zoom meeting
- Check browser console for errors
- Verify Zoom app configuration

## Need Help?

- Check [SETUP.md](./docs/SETUP.md) for detailed instructions
- Review existing GitHub issues
- Create a new issue with details

Happy coding! 🚀
