# Zoom Marketplace Configuration Checklist

## Error 40014: "Configuration was denied, please check that the application has the Zoom App SDK feature enabled"

This error means the **Zoom App SDK feature is NOT enabled** in your Zoom Marketplace app settings. Follow this exact checklist:

---

## CRITICAL: Features Tab Configuration

### Step 1: Go to Zoom Marketplace
1. Navigate to: **https://marketplace.zoom.us/develop/apps**
2. Click on your **Sidekick** app

### Step 2: Open Features Tab
1. In the left sidebar, click **"Features"**
2. You should see a page with various feature toggles

### Step 3: Enable Zoom App SDK (MOST IMPORTANT!)

Look for a section called **"Zoom App SDK"** or **"App SDK"**

**There MUST be a toggle switch that says "Zoom App SDK" or "Enable SDK"**

✅ **This toggle MUST be turned ON (enabled/blue)**

If you see:
- ❌ Toggle is OFF (grey/disabled) → **TURN IT ON**
- ❌ No toggle exists → **Your app might be the wrong type**

**After enabling the toggle, click "Save" at the bottom of the page!**

### Step 4: Configure Where Users Can Access the App

Under **"Where can users access your Zoom App?"**, check these boxes:

✅ **In-Meeting (Client)** - MUST be checked

You can leave others unchecked for now.

**Click "Save Changes"**

---

## Other Required Configurations

### Features Tab - Additional Settings

**Zoom App Context** (if this section exists):
- Enable any required contexts for in-meeting use

**Embedded Browser** (if this section exists):
- May need to be enabled depending on your Zoom app configuration

### Basic Information Tab

Verify these are set correctly:

**App Credentials:**
- **Client ID:** Should be auto-generated (starts with letters/numbers)
- **Client Secret:** Should be auto-generated

**URLs:**
- **Home URL:** `https://side-kick-frontend-mauve.vercel.app`
- **Redirect URL for OAuth:** `https://side-kick-frontend-mauve.vercel.app/auth/zoom/callback`

**IMPORTANT:**
- No `https://` prefix in Home URL field (if it's a separate field)
- Exact URL, no trailing slash
- Must use HTTPS

### Installation Tab (if exists)

Some Zoom Apps have an Installation tab:

- **Install Location:** Meeting
- **Who can install:** Anyone (for testing)

### Scopes Tab

For basic functionality with zero capabilities, you can leave scopes empty or minimal:

**Optional scopes to add:**
- `zoomapp:inmeeting` - Basic in-meeting functionality

**Click "Save"**

### Local Test Tab

**Activation Status:**
- [ ] Click **"Activate"** or **"Add"** button
- [ ] Status should show: **"Activated"** or **"Local test started"**

**Test Users:**
- [ ] Add your Zoom account email address
- [ ] Click "Add" or "Save"

**IMPORTANT:** Use the same email you're logged into Zoom with!

---

## Verification Steps

### After Configuring Everything:

1. **Save All Changes**
   - Click "Save" or "Save Changes" on EVERY tab you modified
   - Look for confirmation message

2. **Wait for Propagation**
   - Wait **5-10 minutes** for changes to propagate through Zoom's system
   - DO NOT test immediately

3. **Clear Zoom Cache**
   - **Quit Zoom completely** (don't just close the window)
   - On Windows: Right-click Zoom icon in system tray → Quit
   - On Mac: Zoom menu → Quit Zoom
   - **Restart Zoom**

4. **Clear Browser Cache** (if testing in browser)
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

5. **Redeploy Frontend**
   - Make sure Vercel deployment is complete
   - Check latest commit hash matches

---

## Still Getting Error 40014?

### Check App Type (Critical!)

1. Go back to: https://marketplace.zoom.us/develop/apps
2. Look at your app in the list
3. **What does it say under the app name?**

**Must say: "Zoom Apps"**

If it says:
- ❌ "OAuth" → Wrong type, create new app
- ❌ "General App" → Wrong type, create new app
- ❌ "Webhook" → Wrong type, create new app
- ❌ "Chatbot" → Wrong type, create new app

**If your app is the wrong type:**
- You CANNOT change the type
- You must create a NEW app
- Select "Zoom Apps" as the type

### Create New "Zoom Apps" Type App

1. Click **"Create"** or **"Build App"**
2. Select **"Zoom Apps"** (should have SDK icon)
3. Fill in:
   - **App Name:** Sidekick
   - **Short Description:** Sales checklist assistant
4. After creation, configure as described above
5. **CRITICAL:** In Features tab, enable "Zoom App SDK" toggle
6. Update your frontend with the new Client ID (if different)

---

## Screenshot Checklist

To help debug, please provide screenshots of:

1. **Apps List Page**
   - Shows your app type badge/label
   - URL: https://marketplace.zoom.us/develop/apps

2. **Features Tab**
   - Shows Zoom App SDK toggle status (ON/OFF)
   - Shows where users can access the app checkboxes

3. **Basic Information Tab**
   - Shows Client ID (you can blur the secret)
   - Shows Home URL and Redirect URL

4. **Local Test Tab**
   - Shows activation status
   - Shows test users list

---

## Expected Behavior When Correctly Configured

Once everything is set up correctly:

✅ **No OAuth permission screen** (for SDK apps, this is optional)
✅ **No error messages**
✅ **App loads in Zoom sidebar**
✅ **Shows "Sidekick" header**
✅ **Shows 5 sales playbook templates**

---

## Quick Diagnostic

**Run this checklist RIGHT NOW:**

- [ ] Is app type "Zoom Apps"? (not OAuth)
- [ ] Is "Zoom App SDK" toggle ON in Features tab?
- [ ] Is "In-Meeting (Client)" checked in Features tab?
- [ ] Did you click "Save" on Features tab?
- [ ] Is Local Test "Activated"?
- [ ] Is your email added as test user?
- [ ] Did you wait 5-10 minutes after saving?
- [ ] Did you restart Zoom completely?
- [ ] Is frontend deployment complete on Vercel?

**If ANY of these is NO, fix it before testing again!**

---

## Contact Information

If you've verified ALL of the above and still get the error, provide:

1. Screenshot of Features tab showing SDK toggle
2. Screenshot of app type from apps list
3. Your Zoom client version (Help → About Zoom)
4. Exact error message from the app
5. Browser console logs (if any)
