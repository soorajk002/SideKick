# 📱 Zoom App Configuration Guide

After deploying your frontend and backend, you need to configure your Zoom app with the production URLs.

## 🎯 What You'll Need

Before starting, have these ready:
- ✅ Frontend URL (e.g., `https://sidekick.vercel.app`)
- ✅ Backend URL (e.g., `https://sidekick.up.railway.app`)

---

## 📋 Step-by-Step Configuration

### Step 1: Open Your Zoom App Settings

1. Go to [marketplace.zoom.us](https://marketplace.zoom.us)
2. Sign in with your Zoom account
3. Click **"Manage"** in the top right
4. Find your **SideKick** app
5. Click **"View"** or the app name

---

### Step 2: Basic Information

1. Click **"Basic Information"** tab (left sidebar)

2. **App Name**: SideKick (or your chosen name)

3. **Short Description**:
   ```
   AI-powered sales playbook tracker for Zoom meetings
   ```

4. **Long Description**:
   ```
   SideKick helps sales teams execute perfect calls by tracking sales playbooks in real-time.
   The app listens to your conversation and automatically checks off completed items using AI,
   ensuring you never miss a critical step in your sales process.
   ```

5. **Home URL**:
   ```
   https://your-frontend.vercel.app
   ```
   ⚠️ Replace with your actual Vercel URL!

6. **Redirect URL for OAuth**:
   ```
   https://your-frontend.vercel.app/auth/zoom/callback
   ```

7. Click **"Save"**

---

### Step 3: App Credentials

1. Stay in **"Basic Information"** or click **"App Credentials"** tab

2. **Note these values** (you should already have them in your environment variables):
   - Client ID
   - Client Secret

3. If you need to regenerate:
   - Click **"View"** next to Client Secret
   - Click **"Regenerate"** if needed
   - ⚠️ Update in your backend environment variables if changed!

---

### Step 4: Features - Event Subscriptions

1. Click **"Features"** tab (left sidebar)

2. Click **"Event Subscriptions"**

3. **Enable Event Subscriptions**: Toggle ON

4. **Event notification endpoint URL**:
   ```
   https://your-backend.up.railway.app/api/webhooks/zoom
   ```
   ⚠️ Replace with your actual Railway/Vercel backend URL!

5. Click **"Validate"**
   - Should show ✅ green checkmark
   - If ❌ fails: Check backend URL, ensure it's deployed and accessible

6. **Add Event Subscriptions**:

   Click **"Add Event Subscription"** and select:
   - ✅ `meeting.transcription_message` - For real-time transcription
   - ✅ `meeting.transcription_completed` - When transcription finishes

7. Click **"Save"**

---

### Step 5: Scopes

1. Click **"Scopes"** tab (left sidebar)

2. Click **"Add Scopes"**

3. Add these scopes:
   - ✅ `meeting:read` - Read meeting information
   - ✅ `meeting:write` - Manage meetings
   - ✅ `user:read` - Read user information

4. Click **"Continue"**

---

### Step 6: Activation

1. Click **"Activation"** tab (left sidebar)

2. For **Development/Testing**:
   - Click **"Add"** button
   - This adds the app to your account only
   - Your team can now test it

3. For **Production** (when ready):
   - Fill out all required information
   - Click **"Submit for Review"**
   - Wait for Zoom approval (usually 2-3 business days)

---

## ✅ Configuration Checklist

Use this checklist as you configure:

```
Basic Information:
[ ] App name set
[ ] Descriptions added
[ ] Home URL set to: https://your-frontend.vercel.app
[ ] Redirect URL set to: https://your-frontend.vercel.app/auth/zoom/callback
[ ] Saved

App Credentials:
[ ] Client ID noted
[ ] Client Secret noted
[ ] Both match backend environment variables

Event Subscriptions:
[ ] Event subscriptions enabled
[ ] Webhook URL set to: https://your-backend.up.railway.app/api/webhooks/zoom
[ ] Webhook validated (green checkmark ✅)
[ ] meeting.transcription_message added
[ ] meeting.transcription_completed added
[ ] Saved

Scopes:
[ ] meeting:read added
[ ] meeting:write added
[ ] user:read added
[ ] Saved

Activation:
[ ] App added to account (for testing)
[ ] OR submitted for review (for production)
```

---

## 🧪 Verify Configuration

### Test 1: Webhook Validation

The webhook URL should have validated with a ✅ green checkmark.

If it fails:
```bash
# Test your webhook endpoint manually
curl https://your-backend.up.railway.app/api/webhooks/zoom

# Should return 404 or require proper Zoom signature
# But it confirms the endpoint is accessible
```

### Test 2: App Loads in Zoom

1. Open Zoom desktop client
2. Start a meeting
3. Click **"Apps"** button
4. Search for your app name
5. App should appear and open in sidebar

---

## 🐛 Troubleshooting

### Issue: Webhook validation fails

**Causes:**
- Backend not deployed
- Backend URL incorrect
- ZOOM_WEBHOOK_SECRET_TOKEN mismatch
- Firewall blocking requests

**Solutions:**
```bash
# 1. Test backend is accessible
curl https://your-backend.up.railway.app/health

# 2. Check backend logs for webhook attempts
# Railway: Dashboard → Service → Logs
# Vercel: Dashboard → Project → Logs

# 3. Verify ZOOM_WEBHOOK_SECRET_TOKEN matches
# - Check Zoom: Features → Event Subscriptions → Secret Token
# - Check Backend: Environment variables
```

### Issue: App doesn't appear in Zoom

**Solutions:**
- Ensure app is "Added" in Activation tab
- Restart Zoom desktop client
- Check app name spelling
- Try using direct app URL if available

### Issue: App loads but shows errors

**Check:**
- Browser console (F12) for frontend errors
- Backend logs for API errors
- Verify VITE_BACKEND_URL is set in frontend
- Check CORS settings in backend

---

## 📊 Configuration Values Reference

Here's a quick reference of what goes where:

| Setting | Value | Where |
|---------|-------|-------|
| Home URL | `https://your-frontend.vercel.app` | Basic Information |
| Redirect URL | `https://your-frontend.vercel.app/auth/zoom/callback` | Basic Information |
| Webhook URL | `https://your-backend.up.railway.app/api/webhooks/zoom` | Features → Event Subscriptions |
| Client ID | (from Zoom) | Backend env: ZOOM_CLIENT_ID |
| Client Secret | (from Zoom) | Backend env: ZOOM_CLIENT_SECRET |
| Webhook Secret | (from Zoom) | Backend env: ZOOM_WEBHOOK_SECRET_TOKEN |

---

## 🎉 Next Steps

After configuration:

1. ✅ Test app opens in Zoom meeting
2. ✅ Create a checklist
3. ✅ Test manual checking
4. ✅ Enable Zoom transcription
5. ✅ Test AI auto-checking

**Your app is now configured and ready to use!** 🚀

---

## 📞 Need Help?

If you get stuck:
- Check Zoom app logs in Marketplace dashboard
- Review backend logs for errors
- Verify all URLs are correct (no typos!)
- Ensure no trailing slashes in URLs

**Common URL format mistakes:**
- ❌ `https://your-app.vercel.app/` (trailing slash)
- ✅ `https://your-app.vercel.app` (correct)
