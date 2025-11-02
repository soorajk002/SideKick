# 🚀 Deploy Sidekick to Vercel (2 Minutes)

Follow these exact steps to get your dashboard live online!

---

## Step 1: Go to Vercel

1. Open **https://vercel.com/new** in your browser
2. Sign in with GitHub (if not already)

---

## Step 2: Import Your Repository

1. You should see your GitHub repositories listed
2. Find **`SideKick`** repository
3. Click **"Import"** next to it

---

## Step 3: Configure the Project

On the configuration screen:

### 1. Framework Preset
- Should auto-detect as **"Next.js"** ✅

### 2. Root Directory
- **IMPORTANT**: Click **"Edit"** next to Root Directory
- Change from `./` to **`web`**
- This tells Vercel to deploy the web dashboard, not the Zoom app

### 3. Build Settings
- Leave as default (auto-detected)
- Build Command: `npm run build`
- Output Directory: `.next`

---

## Step 4: Add Environment Variables

Click **"Environment Variables"** section to expand it.

**Copy and paste these EXACTLY** (one by one):

### Variable 1: DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://postgres:soorajk1234567892@db.uphayungnrbpgxpqjuyl.supabase.co:5432/postgres
```

### Variable 2: NEXTAUTH_SECRET
```
Name: NEXTAUTH_SECRET
Value: OeVapwm5Iyg58Ch7Cr4hdh7vOfgO0+Wa09R7GByrkz4=
```

### Variable 3: NEXTAUTH_URL
```
Name: NEXTAUTH_URL
Value: https://YOUR-PROJECT-NAME.vercel.app
```
**⚠️ NOTE**: Replace `YOUR-PROJECT-NAME` with your actual Vercel project name (shown at the top)

### Variable 4: OPENAI_API_KEY
```
Name: OPENAI_API_KEY
Value: [Your OpenAI API key - already provided]
```
**Note**: Use the OpenAI key you already have (starts with `sk-proj-`)

### Variable 5: NEXT_PUBLIC_APP_URL
```
Name: NEXT_PUBLIC_APP_URL
Value: https://YOUR-PROJECT-NAME.vercel.app
```
**⚠️ NOTE**: Same as NEXTAUTH_URL - replace with your project name

### Variable 6: NEXT_PUBLIC_API_URL
```
Name: NEXT_PUBLIC_API_URL
Value: https://side-kick-backend.vercel.app
```
(We'll set up the backend later if needed)

---

## Step 5: Deploy!

1. Click **"Deploy"** button
2. Wait 2-3 minutes for build to complete
3. You'll see a success screen with your URL

---

## Step 6: Update NEXTAUTH_URL (Important!)

After deployment:

1. Copy your deployed URL (e.g., `https://sidekick-dashboard.vercel.app`)
2. Go to **Settings** tab in Vercel
3. Click **Environment Variables**
4. Find `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`
5. Click **Edit** and update with your actual URL
6. Click **Save**
7. Go to **Deployments** tab
8. Click **"Redeploy"** on the latest deployment

---

## Step 7: Access Your Dashboard! 🎉

1. Click the deployment URL
2. You should see your **Sidekick landing page** with orange branding!
3. Click **"Sign Up"** to create your account
4. Start using the dashboard!

---

## 📝 Environment Variables Checklist

Make sure you've added ALL of these:

- ✅ `DATABASE_URL` - Your Supabase PostgreSQL URL
- ✅ `NEXTAUTH_SECRET` - Auto-generated secret
- ✅ `NEXTAUTH_URL` - Your Vercel deployment URL
- ✅ `OPENAI_API_KEY` - Your OpenAI key for AI features
- ✅ `NEXT_PUBLIC_APP_URL` - Your Vercel deployment URL
- ✅ `NEXT_PUBLIC_API_URL` - Backend URL (placeholder for now)

---

## 🔧 After Deployment

### Set Up Database Tables

The database tables aren't created automatically. You need to run migrations once:

**Option A: Run locally**
```bash
cd web
npm install
npm run db:push
```

**Option B: Use Vercel CLI** (if installed)
```bash
vercel env pull
npm run db:push
```

This creates all the tables in your Supabase database.

---

## 🎯 What You'll Have

Once deployed:

- **Live URL**: `https://your-project.vercel.app`
- **Signup/Login**: Email + password authentication
- **Dashboard**: Full analytics and templates
- **AI Features**: Auto-checking during Zoom meetings
- **Your Branding**: Orange (#DA3301) + Poppins font

---

## ⚡ Troubleshooting

### "Application error" after deployment
- Check environment variables are set correctly
- Make sure `NEXTAUTH_URL` matches your deployment URL
- Check Vercel logs: **Deployments** → Click deployment → **View Function Logs**

### "Database connection failed"
- Verify `DATABASE_URL` is correct
- Make sure you ran `npm run db:push` to create tables
- Check Supabase database is running

### Blank page or 404
- Ensure **Root Directory** is set to `web` (not root)
- Redeploy with correct settings

### Can't sign up / login
- Update `NEXTAUTH_URL` to your actual deployment URL
- Clear browser cookies
- Try incognito mode

---

## 🔄 Making Updates

After deployment, any time you push to GitHub:

1. Vercel auto-deploys new changes
2. Check **Deployments** tab to see progress
3. Latest commit goes live automatically

Or manually redeploy:
- Go to **Deployments** tab
- Click **...** menu on any deployment
- Click **Redeploy**

---

## 🌐 Custom Domain (Optional)

Want your own domain like `sidekick.yourdomain.com`?

1. Go to **Settings** → **Domains**
2. Add your domain
3. Update DNS records (Vercel shows you what to add)
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to new domain
5. Redeploy

---

## 📊 Monitor Your App

- **Analytics**: See traffic in Vercel Analytics tab
- **Logs**: View errors in Function Logs
- **Performance**: Check Web Vitals

---

## Next: Deploy Backend API

Once the dashboard is working, deploy the backend:

1. Go to https://vercel.com/new
2. Import same repository
3. Set **Root Directory** to `backend`
4. Add backend environment variables
5. Deploy
6. Update `NEXT_PUBLIC_API_URL` in dashboard settings

---

**That's it! Your dashboard should be live now! 🚀**

Let me know your deployment URL once it's live!
