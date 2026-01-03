# Fixing 404 Error After Google OAuth Consent

## The Problem

You're getting to the Google consent page, but when you click "Continue", you get a 404 error. This means Google is trying to redirect to a URL that doesn't exist or isn't configured correctly.

## Root Cause

The redirect URI in Google Cloud Console must **exactly match** what Supabase expects. When you click "Continue" on Google's consent page, Google redirects to the callback URL. If that URL isn't configured correctly, you get a 404.

## Step-by-Step Fix

### Step 1: Verify Supabase Callback URL

1. Go to [Supabase Dashboard](https://app.supabase.com) → Your Project
2. Go to **Authentication** → **Providers** → **Google**
3. Look at the **Redirect URL** shown (it should be):
   ```
   https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback
   ```
4. **Copy this exact URL** (including `https://` and `/auth/v1/callback`)

### Step 2: Verify Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID (the one for ShikshAq)
4. Click to **Edit** it
5. In **Authorized redirect URIs**, check:
   - ✅ Should have: `https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback`
   - ❌ Should NOT have: `https://shikshaq.vercel.app` or any Vercel URL
   - ❌ Should NOT have: `http://localhost:8080` (unless testing locally)

6. **Important**: The URL must match **EXACTLY**:
   - ✅ Correct: `https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback`
   - ❌ Wrong: `https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback/` (trailing slash)
   - ❌ Wrong: `https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback?something=value` (query params)
   - ❌ Wrong: `https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback#fragment` (hash)

7. If it's not there or doesn't match exactly:
   - Click **Add URI**
   - Paste: `https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback`
   - Click **Save**

### Step 3: Verify Supabase Settings

1. Go to Supabase Dashboard → **Settings** → **Auth**
2. **Site URL** should be: `https://shikshaq.vercel.app`
3. **Redirect URLs** should include: `https://shikshaq.vercel.app/**`
4. Click **Save**

### Step 4: Wait and Test

1. **Wait 1-2 minutes** after making changes (Google and Supabase need time to propagate)
2. **Clear browser cache** or use incognito mode
3. Try signing in with Google again

## Common Mistakes

### ❌ Wrong: Multiple Redirect URIs
```
https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback
https://shikshaq.vercel.app/auth  ← WRONG! Remove this
```

### ✅ Correct: Only Supabase Callback
```
https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback  ← ONLY this one
```

### ❌ Wrong: Trailing Slash or Extra Characters
```
https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback/  ← Trailing slash
```

### ✅ Correct: Exact Match
```
https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback  ← Exact match
```

## How to Verify It's Fixed

1. Go to: `https://shikshaq.vercel.app/auth`
2. Click "Continue with Google"
3. You should see Google consent page
4. Click "Continue"
5. **Should redirect to**: `https://shikshaq.vercel.app/auth#access_token=...`
6. **Should NOT see**: 404 error

## If Still Getting 404

1. **Check the exact error**:
   - Open browser DevTools (F12) → Network tab
   - Try signing in again
   - Look for the failed request
   - Check what URL it's trying to access

2. **Verify in Google Cloud Console**:
   - Make sure the redirect URI is saved
   - Check for typos
   - Make sure there are no extra spaces

3. **Check Supabase Logs**:
   - Supabase Dashboard → Logs → API Logs
   - Look for errors around the time you tried to sign in

4. **Test the callback URL directly**:
   - Try visiting: `https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback`
   - You should see a Supabase page (not 404)
   - If you see 404, there's a Supabase configuration issue

## Quick Checklist

- [ ] Google Cloud Console has ONLY: `https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback`
- [ ] No trailing slashes or extra characters
- [ ] Supabase Site URL: `https://shikshaq.vercel.app`
- [ ] Supabase Redirect URLs: `https://shikshaq.vercel.app/**`
- [ ] Waited 1-2 minutes after making changes
- [ ] Cleared browser cache
- [ ] Tested in incognito mode

The most common issue is having the wrong redirect URI in Google Cloud Console or having multiple redirect URIs that conflict.

