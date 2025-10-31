# 🗄️ Using Supabase for SideKick Database

Supabase is a great choice for SideKick! It offers:
- ✅ **Generous free tier** - 500MB database, 2GB bandwidth
- ✅ **PostgreSQL** - Fully compatible with our setup
- ✅ **Auto backups** - Daily backups on paid plans
- ✅ **Easy setup** - Get running in 5 minutes
- ✅ **Great dashboard** - Manage data visually

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub (recommended) or email
4. Verify your email

### Step 2: Create New Project

1. Click **"New project"**
2. Fill in project details:
   - **Name**: `sidekick` (or your preference)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
   - **Plan**: Free (perfect for getting started)
3. Click **"Create new project"**
4. Wait ~2 minutes for database to provision

### Step 3: Get Connection String

1. In your Supabase project dashboard:
   - Click **"Settings"** (gear icon in sidebar)
   - Click **"Database"**
   - Scroll to **"Connection string"** section
   - Select **"URI"** tab
   - Copy the connection string (looks like `postgresql://postgres:[YOUR-PASSWORD]@...`)

2. **Important**: Replace `[YOUR-PASSWORD]` with your actual database password

**Example:**
```
postgresql://postgres.abcdefghijk:MySecurePassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## 🔧 Configure SideKick to Use Supabase

### For Local Development

1. **Update `.env` file in backend folder:**
```bash
cd backend
```

2. **Edit `.env` file** (create if it doesn't exist):
```bash
# Supabase Database
DATABASE_URL=postgresql://postgres.xxxxx:YourPassword@xxx.supabase.co:6543/postgres

# Other variables remain the same
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret
OPENAI_API_KEY=your_openai_key
# ... etc
```

3. **Test connection:**
```bash
npm run db:push
```

If successful, you'll see:
```
✓ Pushing schema changes to database
✓ Done!
```

---

## 🚢 Configure for Production Deployment

### For Railway:

1. Go to Railway dashboard
2. Click on your backend service
3. Go to **"Variables"** tab
4. Update or add:
   ```
   DATABASE_URL=postgresql://postgres.xxxxx:YourPassword@xxx.supabase.co:6543/postgres
   ```
5. Railway will auto-redeploy

### For Vercel:

1. Go to Vercel dashboard
2. Select your backend project
3. Go to **Settings** → **Environment Variables**
4. Add or update:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string
   - **Environment**: Production
5. Redeploy your project

---

## 📊 Initialize Database Schema

After setting up the connection string, initialize your database:

### Option 1: Using npm scripts (Recommended)

```bash
cd backend

# Push schema to Supabase
npm run db:push

# Seed with default templates
npm run db:seed
```

### Option 2: Manual migration

```bash
cd backend

# Install dependencies if not already
npm install

# Set environment variable temporarily
export DATABASE_URL="your_supabase_connection_string"

# Run migrations
npx drizzle-kit push:pg

# Run seed
npx tsx src/db/seed.ts
```

---

## ✅ Verify Setup

### 1. Check Tables in Supabase Dashboard

1. Go to your Supabase project
2. Click **"Table Editor"** in sidebar
3. You should see these tables:
   - `users`
   - `templates`
   - `checklists`
   - `transcriptions`
   - `checklist_matches`

### 2. Check Data

1. Click on **"templates"** table
2. You should see 5 rows (our default templates):
   - Discovery Call
   - Product Demo
   - Closing Call
   - Follow-up Call
   - Qualification Call

### 3. Test Backend Connection

```bash
# Test health endpoint
curl https://your-backend.up.railway.app/health

# Test templates endpoint
curl https://your-backend.up.railway.app/api/templates
```

---

## 🔒 Security Best Practices

### 1. Use Connection Pooling

Supabase provides connection pooling by default. Always use the **pooler** URL:
```
✅ Good: @xxx.pooler.supabase.com:6543
❌ Avoid: @xxx.supabase.com:5432
```

The pooler URL (port 6543) handles connections efficiently for serverless deployments.

### 2. Enable Row Level Security (Optional)

For additional security:
1. Go to **Table Editor**
2. Select a table
3. Click **"..." menu** → **"Edit table"**
4. Enable **"Row Level Security"**
5. Add policies as needed

### 3. Rotate Database Password

From Supabase dashboard:
1. Settings → Database
2. Scroll to **"Database password"**
3. Click **"Reset database password"**
4. Update `DATABASE_URL` in all deployments

---

## 🎯 Connection String Formats

Supabase provides different connection formats:

### 1. **URI (Transaction Mode)** - Best for most cases
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@[HOST].pooler.supabase.com:6543/postgres
```
Use this for SideKick!

### 2. Session Mode - For long-lived connections
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@[HOST].pooler.supabase.com:5432/postgres
```

### 3. Direct Connection - No pooling
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@[HOST].supabase.com:5432/postgres
```

**For Vercel/Railway serverless, always use Transaction Mode (port 6543)!**

---

## 📈 Monitor Your Database

### Supabase Dashboard:

1. **Database** tab shows:
   - Table sizes
   - Connection count
   - Database health

2. **SQL Editor** - Run custom queries:
   ```sql
   -- Check number of checklists
   SELECT COUNT(*) FROM checklists;

   -- View recent templates
   SELECT * FROM templates ORDER BY created_at DESC;

   -- Check storage usage
   SELECT pg_size_pretty(pg_database_size('postgres'));
   ```

3. **Logs** - View database logs and queries

---

## 💰 Pricing & Limits

### Free Tier (Perfect for starting):
- ✅ 500 MB database space
- ✅ 2 GB bandwidth per month
- ✅ 500K Edge Function invocations
- ✅ 50 MB file storage
- ✅ Daily backups (7 days retention)
- ✅ Social OAuth providers
- ✅ Community support

### When to Upgrade ($25/month Pro):
- Need more than 500 MB database
- Want point-in-time recovery
- Need daily backups with 30-day retention
- Want email support
- Exceeded free tier limits

**For SideKick:** Free tier is more than enough for 100s of users!

---

## 🔧 Troubleshooting

### Issue 1: "Connection timeout"

**Solution:**
- Ensure you're using the **pooler** URL (port 6543)
- Check your database password is correct
- Verify project is not paused (Supabase pauses inactive free projects after 1 week)

### Issue 2: "Too many connections"

**Solution:**
- Use connection pooling URL (port 6543)
- Add `?pgbouncer=true` to connection string:
```
postgresql://...@host:6543/postgres?pgbouncer=true
```

### Issue 3: "SSL connection required"

**Solution:**
Add `?sslmode=require` to your connection string:
```
postgresql://...@host:6543/postgres?sslmode=require
```

### Issue 4: "Database not found"

**Solution:**
- Wait 2-3 minutes after creating project
- Refresh Supabase dashboard
- Check project status in dashboard

### Issue 5: "Authentication failed"

**Solution:**
- Double-check password (no spaces before/after)
- Password special characters might need URL encoding
- Try resetting database password in Supabase dashboard

---

## 🚀 Complete Setup Example

Here's a complete example of setting up Supabase for SideKick:

```bash
# 1. Create Supabase project on supabase.com

# 2. Copy connection string from Settings → Database

# 3. Set up locally
cd backend
echo 'DATABASE_URL="postgresql://postgres.abc123:SecurePass@db.xxx.supabase.co:6543/postgres"' > .env

# 4. Install dependencies
npm install

# 5. Push schema to Supabase
npm run db:push

# Expected output:
# ✓ Pushing schema changes to database
# ✓ Done!

# 6. Seed with templates
npm run db:seed

# Expected output:
# Starting database seeding...
# Inserted template: Discovery Call
# Inserted template: Product Demo
# Inserted template: Closing Call
# Inserted template: Follow-up Call
# Inserted template: Qualification Call
# Database seeding completed successfully

# 7. Verify in Supabase dashboard
# - Open Table Editor
# - See 5 templates ✓

# 8. Add to production (Railway/Vercel)
# - Add DATABASE_URL to environment variables
# - Deploy!
```

---

## 📝 Environment Variable Quick Reference

### Local (.env):
```bash
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@HOST.pooler.supabase.com:6543/postgres
```

### Railway:
```bash
# Add in Variables tab
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@HOST.pooler.supabase.com:6543/postgres
```

### Vercel:
```bash
# Add in Settings → Environment Variables
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@HOST.pooler.supabase.com:6543/postgres
```

---

## 🎉 Benefits of Using Supabase

1. **Free to Start**: No credit card required
2. **Easy Scaling**: Upgrade when you need more
3. **Built-in Features**:
   - Authentication (if you want to add user accounts later)
   - Storage (for file uploads)
   - Realtime subscriptions (for advanced features)
4. **Great Developer Experience**: Beautiful dashboard, SQL editor
5. **Automatic Backups**: Sleep well knowing your data is safe

---

## 🔄 Migrating from Another Database

If you're switching to Supabase from Railway or another provider:

1. **Export existing data** (if any):
   ```bash
   pg_dump OLD_DATABASE_URL > backup.sql
   ```

2. **Import to Supabase**:
   ```bash
   psql "postgresql://postgres.xxx:password@xxx.supabase.co:6543/postgres" < backup.sql
   ```

3. **Update environment variables** everywhere with new Supabase URL

4. **Run migrations** to ensure schema is current:
   ```bash
   npm run db:push
   ```

---

## ✅ Next Steps

1. ✅ Create Supabase account
2. ✅ Create new project
3. ✅ Copy connection string
4. ✅ Update `.env` in backend
5. ✅ Run `npm run db:push`
6. ✅ Run `npm run db:seed`
7. ✅ Verify tables in Supabase dashboard
8. ✅ Update production environment variables
9. ✅ Deploy and test!

---

## 📞 Need Help?

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Supabase Discord**: Great community support
- **GitHub Issues**: Report SideKick-specific issues

---

**Ready to use Supabase?** Follow the steps above and you'll be running in 5 minutes! 🚀
