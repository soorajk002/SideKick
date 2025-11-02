# 👥 User Flow Documentation - Sidekick

This document explains how users discover, sign up, and use Sidekick from both entry points.

---

## 🌐 Flow 1: Website User Journey

### Discovery → Signup → Dashboard → Zoom App

```
┌─────────────────────────────────────────────────────────────────┐
│                     WEBSITE USER FLOW                            │
└─────────────────────────────────────────────────────────────────┘

Step 1: DISCOVERY
📍 https://your-sidekick.vercel.app
┌──────────────────────────────────┐
│   Landing Page                    │
│  ─────────────────────────────   │
│  ✨ Hero Section                 │
│     "Never Miss a Step in Your   │
│      Sales Calls"                │
│                                   │
│  📋 Features (6 cards):          │
│     • Smart Checklists           │
│     • AI Auto-Checking           │
│     • Analytics Dashboard        │
│     • Custom Templates           │
│     • Team Collaboration         │
│     • Meeting Notes              │
│                                   │
│  💰 Pricing:                     │
│     • FREE - 5 meetings/month    │
│     • PRO - $29/user/month       │
│     • ENTERPRISE - Custom        │
│                                   │
│  [Get Started] [Learn More]      │
└──────────────────────────────────┘
         │
         │ User clicks "Get Started"
         ▼

Step 2: SIGNUP
📍 /signup
┌──────────────────────────────────┐
│   Sign Up Page                    │
│  ─────────────────────────────   │
│  Create your account              │
│                                   │
│  📧 Email: [_______________]     │
│  🔒 Password: [_______________]  │
│                                   │
│  Password strength: ███░░         │
│                                   │
│  [Create Account]                │
│                                   │
│  ─── Or sign up with ───         │
│  [Google] [Microsoft] [Zoom]     │
│                                   │
│  Already have account? [Login]   │
└──────────────────────────────────┘
         │
         │ User creates account
         │ Backend creates:
         │  • User record in database
         │  • Default organization
         │  • Session token
         ▼

Step 3: ONBOARDING (First Login)
📍 /dashboard
┌──────────────────────────────────┐
│   Welcome Modal (first time)      │
│  ─────────────────────────────   │
│  👋 Welcome to Sidekick!         │
│                                   │
│  Let's get you started:          │
│                                   │
│  1️⃣ Create your first template   │
│  2️⃣ Install Zoom app             │
│  3️⃣ Join a meeting and test it   │
│                                   │
│  [Get Started] [Skip]            │
└──────────────────────────────────┘
         │
         ▼

Step 4: DASHBOARD HOME
📍 /dashboard
┌──────────────────────────────────┐
│   Dashboard                       │
│  ─────────────────────────────   │
│  📊 Stats (4 cards):             │
│     Total Meetings: 0            │
│     Avg Completion: 0%           │
│     AI Credits: 100              │
│     Team Members: 1              │
│                                   │
│  📅 Recent Meetings:             │
│     [Empty state]                │
│     "No meetings yet. Install    │
│      the Zoom app to start!"     │
│                                   │
│  [Create Template] [Install App] │
└──────────────────────────────────┘
         │
         │ User clicks "Create Template"
         ▼

Step 5: CREATE TEMPLATE
📍 /dashboard/templates
┌──────────────────────────────────┐
│   Templates Page                  │
│  ─────────────────────────────   │
│  📋 My Templates                 │
│  [+ Create Template]             │
│                                   │
│  [Discovery Call]   [Demo Call]  │
│  [Closing Call]                   │
└──────────────────────────────────┘
         │
         │ Clicks "+ Create Template"
         ▼
┌──────────────────────────────────┐
│   Create Template Modal           │
│  ─────────────────────────────   │
│  Template Name:                   │
│  [___________________________]   │
│                                   │
│  Category: [Sales ▼]             │
│                                   │
│  Description:                     │
│  [___________________________]   │
│  [___________________________]   │
│                                   │
│  Checklist Items:                 │
│  ✓ [Introduce yourself]          │
│  ✓ [Qualify budget]              │
│  ✓ [Present solution]            │
│  + [Add item]                    │
│                                   │
│  ✅ Enable AI auto-checking      │
│                                   │
│  [Cancel] [Create Template]      │
└──────────────────────────────────┘
         │
         │ User creates template
         │ Backend saves to database
         ▼

Step 6: INSTALL ZOOM APP
📍 /dashboard/settings (Integrations tab)
┌──────────────────────────────────┐
│   Settings > Integrations         │
│  ─────────────────────────────   │
│  🎥 Zoom                         │
│  Install Sidekick in Zoom        │
│                                   │
│  Status: Not Installed           │
│                                   │
│  [Install Zoom App]              │
│                                   │
│  Instructions:                    │
│  1. Click install button         │
│  2. Authorize Zoom account       │
│  3. Add app to meetings          │
└──────────────────────────────────┘
         │
         │ Clicks "Install Zoom App"
         │ Redirects to Zoom Marketplace
         ▼

Step 7: ZOOM MARKETPLACE
📍 Zoom Marketplace (External)
┌──────────────────────────────────┐
│   Zoom App Marketplace            │
│  ─────────────────────────────   │
│  Sidekick - Sales Checklists     │
│                                   │
│  📸 [Screenshots]                │
│  ⭐⭐⭐⭐⭐                      │
│                                   │
│  Features:                        │
│  • AI-powered checklist          │
│  • Auto-checking items           │
│  • Analytics                      │
│                                   │
│  [Add] [Pre-approve]             │
└──────────────────────────────────┘
         │
         │ User clicks "Add"
         │ Zoom installs app
         ▼

Step 8: READY TO USE
📍 Back to Dashboard
┌──────────────────────────────────┐
│   Dashboard                       │
│  ─────────────────────────────   │
│  ✅ Setup Complete!              │
│                                   │
│  You're ready to:                │
│  ✓ Templates created             │
│  ✓ Zoom app installed            │
│                                   │
│  Next: Join a Zoom meeting       │
│  and open Sidekick!              │
└──────────────────────────────────┘
```

---

## 🎥 Flow 2: Zoom App User Journey

### Zoom Meeting → App Discovery → Quick Use → (Optional) Signup

```
┌─────────────────────────────────────────────────────────────────┐
│                     ZOOM APP USER FLOW                           │
└─────────────────────────────────────────────────────────────────┘

Step 1: IN ZOOM MEETING
📍 User is in a Zoom meeting
┌──────────────────────────────────┐
│   Zoom Meeting                    │
│  ─────────────────────────────   │
│  [Video grid of participants]    │
│                                   │
│  Bottom toolbar:                  │
│  🎤 [Mute] 📹 [Video] 👥 [...] │
│                          │        │
│                          └─────►  │
│  [Share] [Record] [Apps] ◄────   │
│                           ▲       │
│                           │       │
│                  User clicks here │
└──────────────────────────────────┘
         │
         │ Clicks "Apps"
         ▼

Step 2: ZOOM APPS PANEL
📍 Apps sidebar opens
┌──────────────────────────────────┐
│   Apps                            │
│  ─────────────────────────────   │
│  🔍 Search apps                  │
│                                   │
│  Discover:                        │
│  ┌────────────────────────────┐ │
│  │ 📋 Sidekick                │ │
│  │ Sales Checklist & AI       │ │
│  │ ⭐⭐⭐⭐⭐              │ │
│  │ [Add]                      │ │
│  └────────────────────────────┘ │
│                                   │
│  Your Apps:                       │
│  • Miro                           │
│  • Slido                          │
└──────────────────────────────────┘
         │
         │ User clicks "Add" on Sidekick
         │ OR clicks if already added
         ▼

Step 3: ZOOM APP OPENS IN SIDEBAR
📍 Sidekick loads in right sidebar
┌──────────────────────────────────┐
│   Sidekick                    [×] │
│  ─────────────────────────────   │
│  🚀 Sales Checklist              │
│                                   │
│  Select a template to start:     │
│                                   │
│  ┌──────────────────────────┐   │
│  │ 📋 Discovery Call         │   │
│  │ 8 items • AI enabled      │   │
│  │ [Use Template]            │   │
│  └──────────────────────────┘   │
│                                   │
│  ┌──────────────────────────┐   │
│  │ 📋 Product Demo           │   │
│  │ 12 items • AI enabled     │   │
│  │ [Use Template]            │   │
│  └──────────────────────────┘   │
│                                   │
│  ┌──────────────────────────┐   │
│  │ 📋 Closing Call           │   │
│  │ 6 items • AI enabled      │   │
│  │ [Use Template]            │   │
│  └──────────────────────────┘   │
└──────────────────────────────────┘
         │
         │ User clicks "Use Template"
         │ on "Discovery Call"
         ▼

Step 4: CHECKLIST ACTIVE
📍 Checklist running during meeting
┌──────────────────────────────────┐
│   Discovery Call              [×] │
│  ─────────────────────────────   │
│  Progress: 3/8 items (38%)       │
│  ████░░░░░░░░                   │
│                                   │
│  ✅ Introduce yourself           │
│     Completed 00:02              │
│                                   │
│  ✅ Ask about their business     │
│     AI checked 85% • 00:05       │
│                                   │
│  ✅ Identify pain points         │
│     AI checked 92% • 00:08       │
│                                   │
│  ⬜ Qualify budget               │
│     In progress...               │
│                                   │
│  ⬜ Present solution              │
│  ⬜ Demo key features             │
│  ⬜ Discuss timeline              │
│  ⬜ Schedule follow-up            │
│                                   │
│  🎤 AI listening...              │
│  💡 Tip: Mention pricing to      │
│      auto-check "Qualify budget" │
└──────────────────────────────────┘

What's happening behind the scenes:
┌─────────────────────────────────┐
│  Real-time AI Processing:       │
│                                  │
│  1. Zoom sends transcript ──►   │
│  2. Backend analyzes with GPT ──►│
│  3. Items auto-checked ──►      │
│  4. UI updates instantly        │
│                                  │
│  Every 30 seconds or 50+ words  │
└─────────────────────────────────┘
         │
         │ Meeting continues...
         │ User checks items manually
         │ AI checks items automatically
         ▼

Step 5: MEETING ENDS
📍 Checklist completed
┌──────────────────────────────────┐
│   Discovery Call - Complete! 🎉  │
│  ─────────────────────────────   │
│  Progress: 8/8 items (100%)      │
│  ████████████████████████       │
│                                   │
│  ✅ All items completed!         │
│                                   │
│  AI checked: 6 items (75%)       │
│  Manual: 2 items (25%)           │
│                                   │
│  Meeting duration: 28 mins       │
│                                   │
│  ┌──────────────────────────┐   │
│  │ 📊 View Full Analytics    │   │
│  │ [Go to Dashboard] ────────┼──►│
│  └──────────────────────────┘   │
│                                   │
│  [Download Summary]              │
│  [Start New Checklist]           │
└──────────────────────────────────┘
         │
         │ User clicks "Go to Dashboard"
         │ (If not logged in)
         ▼

Step 6: SIGN UP PROMPT (Optional)
📍 Opens in browser
┌──────────────────────────────────┐
│   See Your Meeting Insights       │
│  ─────────────────────────────   │
│  📊 Your meeting was saved!      │
│                                   │
│  Create free account to:         │
│  ✓ View detailed analytics       │
│  ✓ Track all your meetings       │
│  ✓ Create custom templates       │
│  ✓ Share with team               │
│                                   │
│  [Sign Up - It's Free]           │
│  [Continue as Guest]             │
└──────────────────────────────────┘
         │
         │ If user signs up...
         │ Links Zoom data to account
         ▼

Step 7: DASHBOARD WITH DATA
📍 /dashboard (now logged in)
┌──────────────────────────────────┐
│   Dashboard                       │
│  ─────────────────────────────   │
│  📊 Stats:                       │
│     Total Meetings: 1            │
│     Avg Completion: 100%         │
│     AI Credits: 99               │
│     Team Members: 1              │
│                                   │
│  📅 Recent Meetings:             │
│  ┌──────────────────────────┐   │
│  │ Discovery Call - Acme Corp│   │
│  │ Nov 2, 2025 • 28 mins     │   │
│  │ 100% complete             │   │
│  │ AI: 75% auto-checked      │   │
│  │ [View Details]            │   │
│  └──────────────────────────┘   │
└──────────────────────────────────┘
```

---

## 🔄 Flow Comparison

### Website-First vs. Zoom-First

```
┌─────────────────────────────────────────────────────────────────┐
│                     FLOW COMPARISON                              │
└─────────────────────────────────────────────────────────────────┘

WEBSITE-FIRST USER                  ZOOM-FIRST USER
────────────────────                ───────────────

1. Sees landing page           1. In Zoom meeting
2. Signs up                    2. Discovers app in Apps panel
3. Creates templates           3. Uses default template
4. Installs Zoom app           4. Meeting ends
5. Uses in meeting             5. (Optional) Signs up to see analytics
6. Views analytics             6. Creates custom templates

Commitment: HIGH                    Commitment: LOW
Setup time: 5-10 minutes            Setup time: 30 seconds
Value: Custom templates             Value: Quick use
Conversion: Lower                   Conversion: Higher (freemium)
```

---

## 🎯 User Flow States

### Authentication States

```
┌──────────────────────────────────────────────────────────────┐
│  USER STATES & CAPABILITIES                                   │
└──────────────────────────────────────────────────────────────┘

STATE 1: ANONYMOUS (No account)
├─ Can: Use Zoom app with default templates
├─ Can: Check items during meeting
├─ Can: Get AI auto-checking
├─ Cannot: View analytics
├─ Cannot: Create custom templates
├─ Cannot: See meeting history
└─ Data: Stored temporarily, may be lost

STATE 2: REGISTERED (Free account)
├─ Can: Everything anonymous can do
├─ Can: View analytics dashboard
├─ Can: Create custom templates (up to 10)
├─ Can: See meeting history (last 5 meetings)
├─ Can: Export meeting summaries
├─ Cannot: Team features
├─ Cannot: Advanced analytics
└─ Limit: 5 meetings/month

STATE 3: PRO SUBSCRIBER ($29/month)
├─ Can: Everything free can do
├─ Can: Unlimited meetings
├─ Can: Unlimited templates
├─ Can: Team collaboration
├─ Can: Advanced analytics
├─ Can: Priority AI processing
├─ Can: Custom integrations (Salesforce, HubSpot)
└─ Support: Priority support

STATE 4: ENTERPRISE (Custom pricing)
├─ Can: Everything Pro can do
├─ Can: Custom AI models
├─ Can: Dedicated support
├─ Can: SSO/SAML
├─ Can: Custom compliance
├─ Can: White-label options
└─ Support: Dedicated account manager
```

---

## 📊 Data Flow

### How Data Moves Through the System

```
┌──────────────────────────────────────────────────────────────┐
│  DATA FLOW DIAGRAM                                            │
└──────────────────────────────────────────────────────────────┘

DURING ZOOM MEETING:
──────────────────

1. Zoom Meeting
   │
   ├─► Transcript generated (Zoom API)
   │
   └─► Webhook → Backend API
              │
              ├─► Store in database (meetings table)
              │
              ├─► Send to OpenAI GPT-4o-mini
              │      │
              │      └─► AI analysis results
              │             │
              │             └─► Auto-check items
              │                    │
              │                    └─► WebSocket → Zoom App
              │                           │
              │                           └─► UI updates in real-time
              │
              └─► Emit to Web Dashboard (if logged in)
                     │
                     └─► Live analytics update


POST-MEETING:
─────────────

1. Meeting ends
   │
   ├─► Backend triggers post-processing
   │      │
   │      ├─► OpenAI GPT-4 Turbo
   │      │      │
   │      │      └─► Detailed analysis
   │      │             • Sentiment analysis
   │      │             • Action items extraction
   │      │             • Coaching suggestions
   │      │             • Deal scoring
   │      │
   │      └─► Store analysis in database
   │             │
   │             └─► Available in dashboard
   │
   └─► (Optional) Send email summary
          │
          └─► User receives insights


USER VIEWS ANALYTICS:
────────────────────

1. User opens dashboard
   │
   └─► Frontend API call
          │
          ├─► Fetch meetings (with filters)
          │      │
          │      └─► Join with checklists, items, analysis
          │
          ├─► Calculate metrics
          │      • Completion rates
          │      • Win rates
          │      • Top performers
          │      • Template effectiveness
          │
          └─► Render charts & insights
```

---

## 🔐 Authentication Flow

### How Login/Sessions Work

```
┌──────────────────────────────────────────────────────────────┐
│  AUTHENTICATION FLOW                                          │
└──────────────────────────────────────────────────────────────┘

SIGN UP:
────────

1. User fills form
   │
   ├─► Email + Password
   │      │
   │      └─► Backend: POST /api/auth/signup
   │             │
   │             ├─► Validate email format
   │             ├─► Check email not taken
   │             ├─► Hash password (bcrypt)
   │             ├─► Create user in database
   │             ├─► Create default organization
   │             ├─► Create session (NextAuth)
   │             └─► Return JWT token
   │
   └─► OR OAuth (Google/Microsoft/Zoom)
          │
          └─► Backend: NextAuth OAuth flow
                 │
                 ├─► Redirect to provider
                 ├─► User authorizes
                 ├─► Callback with user data
                 ├─► Create/update user
                 └─► Create session


LOGIN:
──────

1. User enters credentials
   │
   ├─► Email + Password
   │      │
   │      └─► Backend: POST /api/auth/signin
   │             │
   │             ├─► Find user by email
   │             ├─► Verify password hash
   │             ├─► Create session (NextAuth)
   │             └─► Return JWT token
   │
   └─► OR OAuth
          │
          └─► Same OAuth flow as signup


SESSION MANAGEMENT:
───────────────────

Frontend (Next.js):
├─► Cookie: next-auth.session-token
├─► Expires: 30 days
├─► Refresh: Automatic
└─► Middleware checks on protected routes

Zoom App (React):
├─► localStorage: authToken
├─► Expires: 7 days
├─► Sent in API headers: Authorization: Bearer <token>
└─► Validated on each request


LINKING ZOOM TO ACCOUNT:
────────────────────────

1. User uses Zoom app anonymously
   │
   └─► Data stored with temporary ID
          │
          └─► User signs up later
                 │
                 └─► Backend links Zoom meetings to user
                        │
                        └─► Historical data now in dashboard
```

---

## 🎨 UI States & Interactions

### What Users See at Each Step

```
┌──────────────────────────────────────────────────────────────┐
│  UI STATE TRANSITIONS                                         │
└──────────────────────────────────────────────────────────────┘

LANDING PAGE (Unauthenticated):
───────────────────────────────
Header: [Logo] [Features] [Pricing] [Login] [Sign Up]
Content: Hero, Features, Pricing, CTA
Footer: Links, Social, Copyright


DASHBOARD (Authenticated):
──────────────────────────
Header: [Logo] [Dashboard] [Templates] [Meetings] [Analytics] [Team] [Settings] [User Menu]
Sidebar: Navigation menu
Content: Based on route
Footer: Minimal

Routes:
├─ /dashboard → Overview stats
├─ /dashboard/templates → Template management
├─ /dashboard/meetings → Meeting history
├─ /dashboard/analytics → Charts & insights
├─ /dashboard/team → Team members
└─ /dashboard/settings → User settings


ZOOM APP:
─────────
Views:
├─ Template Selector (default)
├─ Active Checklist (during meeting)
├─ Meeting Summary (after meeting)
└─ Settings

States:
├─ Loading (SDK initializing)
├─ Ready (template selection)
├─ Active (checklist in use)
├─ Processing (AI analyzing)
└─ Complete (meeting ended)
```

---

## 🚀 Onboarding Optimization

### Getting Users to "Aha!" Moment Fast

```
Website Users → "Aha!" = First AI Auto-Check
─────────────────────────────────────────────
Time to value: 10-15 minutes
Steps: 5-7

Optimize by:
├─ Pre-fill default templates
├─ Skip optional fields
├─ One-click Zoom install
└─ Interactive demo video


Zoom Users → "Aha!" = Instant Checklist in Meeting
───────────────────────────────────────────────────
Time to value: 30 seconds
Steps: 2

Optimize by:
├─ Show default templates immediately
├─ No login required
├─ Auto-select most popular template
└─ Defer signup to post-meeting
```

---

## 📈 Conversion Funnels

```
WEBSITE FUNNEL:
───────────────
Landing Page Views: 1000
  ↓ (30% click CTA)
Signup Page Views: 300
  ↓ (40% complete signup)
New Accounts: 120
  ↓ (60% create template)
Templates Created: 72
  ↓ (50% install Zoom app)
Zoom Installs: 36
  ↓ (80% use in meeting)
Active Users: 29
  ↓ (30% convert to paid)
Paid Users: 9

Conversion Rate: 0.9%


ZOOM FUNNEL:
────────────
Zoom App Views: 1000
  ↓ (90% use template)
Template Used: 900
  ↓ (70% complete meeting)
Meetings Completed: 630
  ↓ (25% view dashboard CTA)
Dashboard Clicks: 158
  ↓ (60% sign up)
New Accounts: 95
  ↓ (15% convert to paid)
Paid Users: 14

Conversion Rate: 1.4%

Winner: Zoom-first (lower friction)
```

---

## 💡 Key Insights

### User Behavior Patterns

1. **Zoom-first users convert better** (lower initial commitment)
2. **Website users are higher intent** (more likely to pay immediately)
3. **AI auto-checking is the "magic moment"** (drives retention)
4. **Post-meeting analytics drive signups** (curiosity about insights)
5. **Template customization drives pro upgrades** (power users need more)

---

## 🎯 Recommendations

### Optimize Conversion

**For Website Flow:**
- Add interactive demo on landing page
- Offer 1-click template imports (industry-specific)
- Show video of AI auto-checking in action
- Free trial includes all Pro features for 14 days

**For Zoom Flow:**
- Delay signup prompt until after 3rd meeting (build habit first)
- Show analytics preview even without signup (tease the value)
- Offer template export to incentivize signup
- Email meeting summary to encourage account creation

**For Both:**
- Reduce time to first AI auto-check
- Celebrate completion milestones
- Show team/industry benchmarks
- Gamify with achievements/badges
