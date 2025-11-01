# Testing Guide - Sidekick SaaS 🧪

Complete guide to test all features of your AI-powered sales checklist app!

---

## 🚀 Quick Setup (First Time)

### 1. **Environment Setup**

Create `.env` files for both apps:

**Backend (`web/.env`):**
```bash
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true

# NextAuth
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-super-secret-key-here

# OpenAI (for AI features)
OPENAI_API_KEY=sk-your-openai-api-key

# Zoom
ZOOM_CLIENT_ID=your-zoom-client-id
ZOOM_CLIENT_SECRET=your-zoom-client-secret
ZOOM_WEBHOOK_SECRET=your-zoom-webhook-secret

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

**Frontend Zoom App (`frontend/.env`):**
```bash
# API URL (points to backend)
VITE_API_URL=http://localhost:3001/api

# Zoom
VITE_ZOOM_CLIENT_ID=your-zoom-client-id
```

### 2. **Install Dependencies**

```bash
# Backend
cd web
npm install

# Frontend
cd ../frontend
npm install
```

### 3. **Database Setup**

```bash
cd web
npm run db:push  # Push schema to Supabase
```

This will create all 15+ tables in your database.

---

## 📱 Testing the Zoom App

### Step 1: Start the Frontend

```bash
cd frontend
npm run dev
```

App runs at: **http://localhost:5173**

### Step 2: Start ngrok (for Zoom)

```bash
ngrok http 5173
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### Step 3: Configure Zoom Marketplace

1. Go to **Zoom Marketplace** → Your App → **App Credentials**
2. Update **OAuth Redirect URL**: `https://abc123.ngrok.io/auth`
3. Update **App URL**: `https://abc123.ngrok.io`
4. Go to **Features** → Enable **"Zoom App SDK"**
5. Go to **APIs** → Enable:
   - `getRunningContext`
   - `openUrl`

### Step 4: Test in Zoom

1. Start a Zoom meeting
2. Click **Apps** in the toolbar
3. Find your app and click it
4. App should load in sidebar! ✅

**What to test:**
- App loads without errors
- "Select Playbook" button works
- Templates load and display
- Can create checklist from template
- Checklist items appear
- Can check/uncheck items manually

---

## 🌐 Testing the Web Dashboard

### Step 1: Start the Backend

```bash
cd web
npm run dev  # Uses custom server with WebSocket
```

Backend runs at: **http://localhost:3001**

### Step 2: Open Browser

Navigate to: **http://localhost:3001**

### Step 3: Test Landing Page

**What to test:**
- ✅ Landing page loads
- ✅ Hero section displays
- ✅ 6 feature cards show correctly
- ✅ Pricing table (Free, Pro, Enterprise)
- ✅ "Get Started Free" buttons work

### Step 4: Test Authentication

**Sign Up:**
1. Click "Get Started Free"
2. Fill in:
   - Name
   - Email
   - Password (8+ chars)
   - Organization name
3. Click "Create Account"
4. Should redirect to `/dashboard` ✅

**Login:**
1. Go to `/login`
2. Enter email/password
3. Click "Sign In"
4. Should redirect to `/dashboard` ✅

### Step 5: Test Dashboard Pages

**Main Dashboard (`/dashboard`):**
- ✅ 4 stat cards show
- ✅ Recent meetings list
- ✅ Upcoming meetings sidebar
- ✅ Quick actions panel
- ✅ Pro tips section

**Templates (`/dashboard/templates`):**
- ✅ Search bar works
- ✅ Category filters work
- ✅ Template cards display
- ✅ Shows usage stats and completion rates
- ✅ AI-enabled badges appear

**Meetings (`/dashboard/meetings`):**
- ✅ Stats cards (Total, Avg Completion, AI Analyzed, Win Rate)
- ✅ Search works
- ✅ Filters work (outcome, template, date range)
- ✅ Meeting cards show all info
- ✅ Completion progress bars
- ✅ AI summaries display

**Analytics (`/dashboard/analytics`):**
- ✅ Key metrics cards
- ✅ AI insights display
- ✅ Completion trend chart
- ✅ Template performance comparison
- ✅ Top performers leaderboard
- ✅ Most skipped items
- ✅ Pipeline breakdown

**Team (`/dashboard/team`):**
- ✅ Team member list displays
- ✅ Role badges (Owner, Admin, Manager, Member)
- ✅ Search works
- ✅ Role filter works
- ✅ Invite modal opens
- ✅ Pending invites show

**Settings (`/dashboard/settings`):**
- ✅ All 6 tabs accessible
- ✅ Profile tab: can edit name, email, timezone
- ✅ Organization tab: company info
- ✅ Billing tab: plan info, payment method, history
- ✅ API Keys tab: can view keys (masked)
- ✅ Integrations tab: Zoom, Salesforce, HubSpot, Slack
- ✅ Notifications tab: email & push preferences
- ✅ Save button works

---

## 🤖 Testing AI Features (The Fun Part!)

### Prerequisites

You need:
1. ✅ OpenAI API key in `.env`
2. ✅ Backend running (`npm run dev`)
3. ✅ Zoom app running
4. ✅ Zoom configured for live transcription

### Setup Zoom Webhooks

1. Go to **Zoom Marketplace** → Your App → **Feature**
2. Enable **"Live Transcription"**
3. Go to **Event Subscriptions**
4. Add endpoint: `https://your-backend.ngrok.io/api/webhooks/zoom`
5. Subscribe to events:
   - `meeting.live_transcription.message` (for real-time)
   - `meeting.ended`
   - `recording.completed`
   - `meeting.transcript_completed`
6. Verify endpoint ✅

### Test Real-Time AI Auto-Checking

**Step 1: Start a Meeting**
1. Start Zoom meeting with your app
2. Enable **Live Transcription** in Zoom
3. Create a checklist (e.g., "Discovery Call")

**Step 2: Talk About Checklist Items**

Say things like:
- "Let's talk about your budget. What's your budget for this?"
- "What are your main pain points?"
- "What's your timeline? When do you need this?"

**What should happen:**
- ⏱️ Every 30 seconds, AI analyzes conversation
- ✅ Items auto-check if detected with ≥70% confidence
- 📊 Confidence % shows next to item
- 💬 Reasoning saved in notes
- 🔔 Notification in console: "✅ Item auto-checked: Budget discussion (85% confidence)"

**Check the logs:**
```bash
# In backend terminal, you'll see:
🤖 AI analysis started...
✅ Analysis complete: 2 items checked (67% complete)
Live transcription for meeting 123: "So our budget is around..."
```

### Test Post-Meeting Analysis

**Step 1: End the Meeting**
1. Stop live transcription
2. End the meeting
3. Wait for Zoom to process recording

**Step 2: Check Database**
```bash
# Backend should receive webhook
Meeting ended: 123
Recording completed: 123
```

**What to verify:**
- Meeting record updated with `endedAt`
- Transcript saved
- AI summary generated
- Sentiment analyzed (positive/neutral/negative)

---

## 🔌 Testing WebSocket Real-Time Updates

### Test WebSocket Connection

**In browser console (Zoom app):**
```javascript
// Check WebSocket status
console.log('WebSocket connected:', socket.connected)

// You should see these logs when items auto-check:
✅ Item auto-checked: Budget discussion (85% confidence)
🤖 AI analysis started...
✅ Analysis complete: 2 items checked
```

### Test Item Auto-Checking

1. **Start meeting** with checklist
2. **Open browser DevTools** (F12)
3. **Go to Network tab** → WS (WebSocket)
4. **Watch for messages:**
   - `item-checked` when AI detects item
   - `transcript-chunk` for live transcription
   - `analysis-started` when processing
   - `analysis-completed` when done

---

## 📊 Testing Analytics API

Use Postman or curl:

**Get Overview Metrics:**
```bash
curl http://localhost:3001/api/analytics?organizationId=your-org-id&metric=overview
```

**Get Template Performance:**
```bash
curl http://localhost:3001/api/analytics?organizationId=your-org-id&metric=templates
```

**Get Team Performance:**
```bash
curl http://localhost:3001/api/analytics?organizationId=your-org-id&metric=team
```

**Get Trends:**
```bash
curl http://localhost:3001/api/analytics?organizationId=your-org-id&metric=trends
```

---

## 🛠️ Common Issues & Fixes

### Issue: "Zoom SDK Error 80004"
**Fix:**
1. Go to Zoom Marketplace → Features
2. Enable "Zoom App SDK" toggle
3. Go to APIs
4. Enable `getRunningContext` and `openUrl`
5. Capabilities in code must match Marketplace

### Issue: "Database connection failed"
**Fix:**
1. Check DATABASE_URL is correct
2. Use **port 6543** for Supabase pooler
3. URL encode password if it has special chars
4. Test connection: `psql "postgresql://..."`

### Issue: "OpenAI API error"
**Fix:**
1. Check OPENAI_API_KEY is valid
2. Check you have credits
3. Test: `curl https://api.openai.com/v1/models -H "Authorization: Bearer sk-..."`

### Issue: "WebSocket not connecting"
**Fix:**
1. Make sure you're using `npm run dev` (not `npm run dev:next`)
2. Check server.js is being used
3. Check port 3001 is not blocked
4. Look for "WebSocket server initialized" in logs

### Issue: "Webhook not receiving events"
**Fix:**
1. Check ngrok is running and HTTPS
2. Verify webhook URL in Zoom Marketplace
3. Check signature verification (disable in dev if needed)
4. Check `ZOOM_WEBHOOK_SECRET` matches
5. Test endpoint: `curl https://your-backend.ngrok.io/api/webhooks/zoom`

### Issue: "AI not auto-checking items"
**Fix:**
1. Check "Live Transcription" enabled in Zoom meeting
2. Check webhook event `meeting.live_transcription.message` subscribed
3. Check OPENAI_API_KEY is set
4. Must speak at least 50 words for first analysis
5. Check backend logs for errors

### Issue: "Frontend build fails"
**Fix:**
1. Run `npm run type-check` to see errors
2. Check all imports exist
3. Make sure `.env` file exists in frontend
4. Clear node_modules and reinstall

---

## ✅ Feature Checklist

Use this to verify everything works:

### Zoom App
- [ ] App loads in Zoom sidebar
- [ ] Can select template
- [ ] Checklist items display
- [ ] Can check/uncheck items manually
- [ ] Items auto-check during meeting (with AI)
- [ ] WebSocket shows real-time updates

### Web Dashboard
- [ ] Landing page loads
- [ ] Sign up works
- [ ] Login works
- [ ] Main dashboard shows stats
- [ ] Templates page works
- [ ] Meetings page works
- [ ] Analytics page works
- [ ] Team page works
- [ ] Settings page works (all 6 tabs)

### API Routes
- [ ] GET /api/templates returns data
- [ ] POST /api/checklists creates checklist
- [ ] PATCH /api/checklists/[id]/items/[itemId] updates item
- [ ] POST /api/checklists/[id]/analyze-realtime works
- [ ] POST /api/checklists/[id]/analyze works
- [ ] POST /api/webhooks/zoom receives events
- [ ] GET /api/analytics returns metrics

### AI Features
- [ ] Real-time analysis every 30 seconds
- [ ] Items auto-check with ≥70% confidence
- [ ] Post-meeting summary generated
- [ ] Sentiment analysis works
- [ ] AI credits tracked
- [ ] WebSocket emits item-checked events

---

## 📈 Performance Testing

### Check AI Costs

Monitor in backend logs:
```
Real-time analysis: ~$0.03 per meeting
Post-call analysis: ~$0.13 per meeting
Total: ~$0.16 per 30-min meeting
```

### Check WebSocket Performance

In browser DevTools → Network → WS:
- Connection should be stable
- Messages should be < 100ms latency
- No disconnects/reconnects

### Check Database Performance

```bash
# In PostgreSQL
SELECT count(*) FROM meetings;
SELECT count(*) FROM checklists;
SELECT count(*) FROM checklist_items;
```

---

## 🎯 Next Steps After Testing

Once everything works:

1. **Deploy to Production**
   - Deploy backend to Vercel
   - Deploy frontend to Vercel
   - Update Zoom Marketplace URLs
   - Configure production environment variables

2. **Add More Templates**
   - Create 10-15 templates for different scenarios
   - Industry-specific templates

3. **Add Stripe Billing**
   - Integrate Stripe
   - Create subscription plans
   - Add payment flow

4. **Launch! 🚀**
   - Beta users
   - Collect feedback
   - Iterate

---

## 🆘 Need Help?

If you encounter issues:

1. **Check logs:**
   - Backend: Terminal running `npm run dev`
   - Frontend: Browser DevTools console
   - Zoom: Zoom app console logs

2. **Check this guide's Common Issues section**

3. **Test incrementally:**
   - Start with Zoom app alone
   - Then add backend
   - Then add AI features

---

**Ready to test? Start with the Zoom app, then move to the web dashboard!** 🚀

Good luck! 🎉
