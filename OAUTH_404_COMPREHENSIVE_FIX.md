# Comprehensive Fix for OAuth 404 Error

## Immediate Fix

### Step 1: Verify Supabase Redirect URLs

1. Go to [Supabase Dashboard](https://app.supabase.com) → Your Project
2. Navigate to **Settings** → **Auth**
3. Scroll to **Redirect URLs** section
4. Ensure you have **EXACTLY** this (with the `/**` wildcard):
   ```
   https://shikshaq.vercel.app/**
   ```
5. Also add for local development (optional):
   ```
   http://localhost:8080/**
   ```
6. Click **Save**

### Step 2: Verify Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Open your OAuth 2.0 Client ID
4. In **Authorized redirect URIs**, ensure you have **ONLY**:
   ```
   https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback
   ```
5. **DO NOT** add `https://shikshaq.vercel.app` here
6. Click **Save**

### Step 3: Verify Supabase Site URL

In Supabase Dashboard → Settings → Auth:
- **Site URL** should be: `https://shikshaq.vercel.app`

## Why This Fixes It

The `/**` wildcard in Supabase Redirect URLs allows Supabase to redirect to ANY path on your domain. Without it, Supabase can only redirect to the exact Site URL, not to `/auth` where your callback handler is.

