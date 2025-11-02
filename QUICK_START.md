# 🚀 Quick Start Guide - Get Dashboard Running in 10 Minutes

This guide will help you get the Sidekick web dashboard running locally so you can sign up and see the interface.

## What You're Setting Up

- **Web Dashboard** at http://localhost:3001
- Signup/Login page
- Dashboard with templates, meetings, analytics
- All with your new branding (#DA3301 orange color + Poppins font)

---

## Step 1: Get a Free Database (2 minutes)

The dashboard needs a database. Here's the fastest free option:

### Supabase (Recommended - Free Forever)

1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub (fastest)
4. Click **"New project"**
   - Name: `sidekick`
   - Database Password: Generate and save it
   - Region: Choose closest to you
   - Click **"Create new project"** (takes ~2 minutes)
5. Once created:
   - Go to **Settings** (left sidebar)
   - Click **Database**
   - Scroll to **Connection string** → **URI**
   - Copy the connection string (looks like `postgresql://postgres.[PROJECT]:PASSWORD@...`)
   - **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the password you created

**Save this URL - you'll need it in Step 3!**

---

## Step 2: Get OpenAI API Key (Optional but Recommended)

For AI auto-checking during meetings:

1. Go to **https://platform.openai.com/api-keys**
2. Sign in or create account
3. Click **"Create new secret key"**
4. Name it: `Sidekick`
5. Copy the key (starts with `sk-`)

**Save this key - you'll need it in Step 3!**

*Skip this if you just want to test the UI first (AI features won't work)*

---

## Step 3: Run the Setup Script

Now let's set everything up automatically:

```bash
# Make sure you're in the SideKick directory
cd /path/to/SideKick

# Run the setup script
./setup-web-dashboard.sh
```

The script will:
- Generate a secure auth secret
- Create your `.env` file
- Ask you to add your DATABASE_URL and OPENAI_API_KEY
- Install all dependencies
- Set up the database tables
- Be ready to start!

### Edit the .env file:

```bash
cd web
nano .env
```

Find these lines and add your values:

```env
# Paste your Supabase connection string here
DATABASE_URL=postgresql://postgres.[PROJECT]:[PASSWORD]@[HOST]/postgres

# Paste your OpenAI key here (or leave blank to test UI only)
OPENAI_API_KEY=sk-your-key-here
```

Press `CTRL + X`, then `Y`, then `ENTER` to save.

---

## Step 4: Start the Dashboard

```bash
cd web
npm run dev
```

You should see:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3001
```

---

## Step 5: Open in Browser

Open your browser and go to:

**👉 http://localhost:3001**

You should see the **Sidekick landing page** with your new branding!

---

## What You Can Do Now

### 1. Sign Up
- Click **"Get Started"** or **"Sign Up"**
- Enter your email and password
- Create your account

### 2. Explore the Dashboard
Once logged in, you'll see:
- **Dashboard** - Overview of meetings and stats
- **Templates** - Sales playbook templates (Discovery Call, Demo Call, etc.)
- **Meetings** - Past meeting history (empty until you start using it)
- **Analytics** - Performance metrics
- **Team** - Team member management
- **Settings** - Profile, billing, integrations

### 3. Create a Template
- Go to **Templates**
- Click **"Create Template"**
- Add checklist items for your sales process

### 4. Test in Zoom
The dashboard is separate from the Zoom app. To test the full experience:

1. **Install Zoom App** (if not already done)
   - Go to Zoom Marketplace
   - Install your app in development mode

2. **Join a Zoom meeting**
   - Open Sidekick from the Apps sidebar
   - Select a template
   - Start checking off items during the call

3. **See AI Auto-Checking** (if OpenAI key is configured)
   - As you talk during the meeting
   - AI will automatically check items off
   - Real-time updates in the Zoom app

---

## Troubleshooting

### "Cannot connect to database"
- Check your `DATABASE_URL` in `.env` is correct
- Make sure you replaced `[YOUR-PASSWORD]` with actual password
- Verify Supabase project is running

### "Internal Server Error" when signing up
- Check `.env` file has all required variables
- Try running: `cd web && npm run db:push`
- Check server logs for specific error

### Port 3001 already in use
```bash
# Kill the process using port 3001
lsof -ti:3001 | xargs kill -9

# Or use a different port
PORT=3002 npm run dev
```

### OpenAI errors
- Verify your `OPENAI_API_KEY` is valid
- Check you have credits in your OpenAI account
- AI features are optional - app works without them

---

## Next Steps

### Deploy to Production

Once you've tested locally and everything works:

1. **Deploy Web Dashboard**
   ```bash
   cd web
   vercel
   ```

2. **Deploy Backend API**
   ```bash
   cd backend
   vercel
   ```

3. **Update Environment Variables** in Vercel dashboard

4. **Update Zoom App URLs** to point to production

See `WEB_DEPLOYMENT.md` for full production deployment guide.

---

## Need Help?

**Common Questions:**

- **"Where's the Zoom app?"** - The Zoom app (https://side-kick-frontend-mauve.vercel.app) only works inside Zoom meetings. You're setting up the web dashboard (signup/login/analytics).

- **"Do I need OpenAI?"** - No, it's optional. You can test the UI and manually check items without AI.

- **"How much does this cost?"**
  - Supabase: Free (500MB database, 50K monthly active users)
  - Vercel: Free (hobby tier)
  - OpenAI: ~$0.16 per 30-minute meeting with hybrid AI

- **"Can I use a different database?"** - Yes, any PostgreSQL database works. Update `DATABASE_URL` accordingly.

---

## Architecture Reminder

```
┌─────────────────────┐
│   Web Dashboard     │ ← You're setting this up now
│  (Next.js + Auth)   │    http://localhost:3001
│   Signup/Login      │
└─────────────────────┘
         │
         │ Calls API
         ▼
┌─────────────────────┐
│      Backend        │
│   (Express API)     │
│   port 8080         │
└─────────────────────┘
         │
         │ Sends data
         ▼
┌─────────────────────┐
│    Zoom App         │ ← Already deployed
│   (React + SDK)     │    (works in Zoom only)
│   Meeting sidebar   │
└─────────────────────┘
```

---

**Ready to start?** Run the setup script:

```bash
./setup-web-dashboard.sh
```
