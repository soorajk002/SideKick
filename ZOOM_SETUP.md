# Zoom Marketplace Configuration Guide

This guide will help you configure your Sidekick app in Zoom Marketplace to fix the "app_not_support" error.

## Required Steps

### 1. Go to Zoom Marketplace
Navigate to: https://marketplace.zoom.us/develop/apps

### 2. Select Your Sidekick App
Click on your **Sidekick** application

### 3. Configure Scopes (CRITICAL)
Go to **Scopes** tab and add these scopes:

**Required Scopes:**
- `zoomapp:inmeeting` - Allows the app to run in meetings
- `zoomapp:running_context` - For getRunningContext() API

**Click "Add" next to each scope and then click "Save"**

### 4. Basic Information
Verify these settings in the **Basic Information** tab:

- **App Name:** Sidekick
- **Short Description:** Sales checklist assistant for Zoom meetings
- **Long Description:** Sidekick helps sales teams follow structured playbooks during calls with AI-powered auto-checking
- **App Type:** Zoom Apps
- **Home URL:** `https://side-kick-frontend-mauve.vercel.app`
- **Redirect URL for OAuth:** `https://side-kick-frontend-mauve.vercel.app/auth/zoom/callback`

### 5. Surface Configuration
Go to **Surface** tab:

**Domain Allow List:**
```
side-kick-frontend-mauve.vercel.app
side-kick-backend-z746.vercel.app
```

**Supported Surfaces:**
- ✅ In-Meeting (Client)

### 6. Features Configuration
Go to **Features** tab and enable:

- **Zoom App SDK APIs:** Enable this toggle
- **In-Meeting:** Enable this toggle

### 7. Local Test / Activation

**For Development:**
1. Go to **Local Test** tab
2. Click **"Activate"** or **"Enable Local Test"**
3. Add your email as a test user

**Important:** Your app MUST be activated for local testing, or the SDK will fail with "app_not_support"

### 8. Save All Changes
Make sure to click **"Save"** on each tab where you made changes!

## After Configuration

1. Wait 5-10 minutes for Zoom to propagate the changes
2. Redeploy your frontend on Vercel (to pick up the latest code)
3. Restart your Zoom client
4. Join a meeting and test Sidekick

## Troubleshooting

### Still getting "app_not_support" error?
- Double-check that **Scopes** are saved
- Verify **Local Test is activated**
- Make sure you added yourself as a **test user**
- Try logging out and back into Zoom client
- Check that app is in **Development** mode (not Production)

### Getting different errors?
Check the error message in the app - it will now show specific error codes that can help debug the issue.

## Next Steps After It Works

Once the app loads successfully with minimal capabilities, we can add more capabilities one by one:

**Additional capabilities to add later:**
- `getMeetingContext` - To get actual meeting ID
- `getMeetingParticipants` - To see who's in the call
- `onActiveSpeakerChange` - For AI auto-checking based on speaker

Each capability needs corresponding scopes configured in Zoom Marketplace.
