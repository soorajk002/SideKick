# Zoom App Error 80004 Troubleshooting

## Current Error
```
Zoom SDK Error: No Permission for this API. [code:80004, reason:app_not_support]
```

This error means your Zoom app configuration in Zoom Marketplace is not correct. Follow these steps EXACTLY.

## Critical Checks

### ✅ Step 1: Verify App Type

1. Go to: https://marketplace.zoom.us/develop/apps
2. Look at your **Sidekick** app
3. Check the **App Type** badge/label

**MUST BE:** "Zoom Apps" (NOT "OAuth", NOT "Webhook", NOT "Chatbot")

**If it's NOT "Zoom Apps":**
- You may need to create a NEW app
- When creating, select **"Zoom Apps"** as the app type
- DO NOT select "General App" or "OAuth"

### ✅ Step 2: Check App Features

1. Click on your Sidekick app
2. Go to the **"Features"** tab
3. Look for **"Zoom App SDK"** section

**Required Settings:**
- **Zoom App SDK:** Toggle should be ON (enabled)
- **Where can users access your Zoom App?**
  - ✅ In-Meeting (Client) - MUST be checked
  - Others can be unchecked for now

### ✅ Step 3: Verify Basic Information

Go to **"Basic Information"** tab:

**Required Fields:**
- **App Name:** Sidekick (or your chosen name)
- **Short Description:** Sales checklist assistant
- **Developer Contact Name:** Your name
- **Developer Contact Email:** Your email

**URLs (CRITICAL):**
- **Home URL:** `https://side-kick-frontend-mauve.vercel.app`
  - Must be EXACTLY this
  - Must use HTTPS
  - No trailing slash

**Company Information:**
- Fill in company name (can be your name if solo)

### ✅ Step 4: Local Test Activation

Go to **"Local Test"** tab:

1. **Status should say: "Activated"** or **"Local test started"**
2. If it says "Not Activated":
   - Click **"Add"** or **"Activate"** button
3. Add yourself as a test user:
   - Enter your Zoom account email
   - Click "Add"
4. **IMPORTANT:** You must use the SAME Zoom account email that you're logged into Zoom with

### ✅ Step 5: Installation Settings (if exists)

Some Zoom Apps have an **"Installation"** tab:

- **Install on:** Meeting
- **Installation Type:** Anyone can install (for testing)

### ✅ Step 6: Scopes Tab

Go to **"Scopes"** tab:

Even though we're using zero capabilities, ensure no conflicting scopes are set. You can leave this empty for now.

### ✅ Step 7: Domain Whitelist

Go to **"Surface"** tab (might be called "App SDK" in some versions):

**Domain Allow List - Add both:**
```
side-kick-frontend-mauve.vercel.app
side-kick-backend-z746.vercel.app
```

**Do NOT include:**
- `https://` prefix
- Trailing slashes
- `www.`

### ✅ Step 8: Save Everything

**CRITICAL:** Click **"Save"** or **"Save Changes"** at the bottom of EVERY tab you edited!

## After Configuration

### 1. Wait for Propagation
- Changes can take **5-10 minutes** to propagate
- Don't test immediately

### 2. Redeploy Frontend
- Go to Vercel
- Trigger a new deployment of the frontend
- Or it should auto-deploy from the latest git push

### 3. Restart Zoom Client
- **Quit Zoom completely** (don't just close the window)
- **Restart Zoom**
- Log in again if needed

### 4. Test in a Meeting
- Start or join a Zoom meeting
- Click **"Apps"** button at the bottom
- Find **Sidekick** in the list
- Click to open it

## Still Getting app_not_support Error?

### Check the App Type (Most Common Issue)
If your app is NOT a "Zoom Apps" type, you need to create a new one:

1. Go to: https://marketplace.zoom.us/develop/apps
2. Click **"Create"** or **"Build App"**
3. Select **"Zoom Apps"**
4. Fill in the basic information
5. Use these exact URLs:
   - **Home URL:** `https://side-kick-frontend-mauve.vercel.app`
   - **Redirect URL:** `https://side-kick-frontend-mauve.vercel.app/auth/zoom/callback`

### Check Zoom Client Version
- Update to the latest Zoom client
- Minimum version: 5.10.0 or higher

### Check Account Type
- Developer accounts sometimes have restrictions
- Try with a paid Zoom account if possible

### Enable Detailed Logging
Open browser console when testing:
1. Right-click in Zoom app panel
2. Click "Inspect" or "Inspect Element"
3. Go to Console tab
4. Look for the detailed error messages

## What This Version Does

The current code uses **ZERO capabilities** - it should work with minimal Zoom Marketplace configuration. Once this works, we'll add capabilities one by one.

**Expected behavior when it works:**
- No error message
- Shows "Sidekick" header
- Shows 5 template buttons (Discovery Call, Product Demo, etc.)
- Templates load from backend

## Need Help?

If you're still stuck, provide these details:
1. Screenshot of your Zoom Marketplace app type (the main apps list page)
2. Screenshot of Features tab
3. Screenshot of Local Test tab showing activation status
4. The exact error message from the app
5. Browser console logs when opening the app
