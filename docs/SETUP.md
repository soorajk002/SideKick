# Setup Guide

This guide will help you set up and run the SideKick Zoom Sales Checklist app locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- **Zoom Developer Account** - [Sign up](https://marketplace.zoom.us/)
- **OpenAI API Key** - [Get key](https://platform.openai.com/)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd SideKick

# Install dependencies for all workspaces
npm install
```

## Step 2: Database Setup

### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sidekick;

# Exit psql
\q
```

### Set up database schema

```bash
cd backend

# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# Seed with default templates
npm run db:seed
```

## Step 3: Zoom App Configuration

### Create a Zoom App

1. Go to [Zoom App Marketplace](https://marketplace.zoom.us/)
2. Click "Develop" → "Build App"
3. Choose "Zoom Apps" (not Meeting SDK or OAuth)
4. Fill in basic information:
   - App Name: SideKick
   - Short Description: Sales checklist tracker
   - Long Description: AI-powered sales playbook tracker

### Configure App Settings

**Home URL:** `http://localhost:3000` (for development)

**Capabilities:**
- Enable "Meeting" capability
- Add required scopes:
  - `meeting:write`
  - `meeting:read`
  - `user:read`

**Event Subscriptions:**
- Enable event subscriptions
- Add subscription endpoint: `https://your-backend-url/api/webhooks/zoom`
- Subscribe to events:
  - `meeting.transcription_message`
  - `meeting.transcription_completed`

### Get Credentials

Note down:
- Client ID
- Client Secret
- Secret Token (for webhooks)

## Step 4: OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Note down the key (it starts with `sk-`)

## Step 5: Environment Variables

Create `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Zoom Configuration
ZOOM_CLIENT_ID=your_zoom_client_id_here
ZOOM_CLIENT_SECRET=your_zoom_client_secret_here
ZOOM_REDIRECT_URI=http://localhost:3000/auth/zoom/callback
ZOOM_WEBHOOK_SECRET_TOKEN=your_webhook_secret_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/sidekick
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sidekick
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Server Configuration
NODE_ENV=development
BACKEND_PORT=8080
FRONTEND_PORT=3000
BACKEND_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRES_IN=7d

# Logging
LOG_LEVEL=debug
```

## Step 6: Run the Application

### Start Backend

```bash
cd backend
npm run dev
```

The backend will start on http://localhost:8080

### Start Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on http://localhost:3000

## Step 7: Test in Zoom

### Local Testing with ngrok

For local development, you'll need to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Expose backend
ngrok http 8080

# Expose frontend
ngrok http 3000
```

Update your Zoom App settings with the ngrok URLs.

### Add App to Zoom

1. In Zoom desktop client, start or join a meeting
2. Click "Apps" in the meeting controls
3. Search for your app name or use the dev URL
4. Click to open the app

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Check connection
psql -U postgres -d sidekick -c "SELECT 1"
```

### Zoom SDK Issues

- Ensure you're testing in an actual Zoom meeting
- Check browser console for errors
- Verify app is published or in development mode

### OpenAI API Issues

- Verify API key is correct
- Check you have credits available
- Ensure correct model name

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
- Check [API.md](./API.md) for API documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

## Support

For issues or questions:
- Check existing issues on GitHub
- Create a new issue with detailed information
- Include logs and error messages
