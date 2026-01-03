# Fixing OAuth 404 Error on Vercel

## Error: 404 NOT_FOUND

This error typically means the redirect URL configuration doesn't match. Here's how to fix it:

## Step-by-Step Verification

### 1. Get Your Supabase Project Reference

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Look at your **Project URL** - it will be something like:
   ```
   https://uvtifolnsneitetzohtn.supabase.co
   ```
5. Your **Project Reference** is: `uvtifolnsneitetzohtn` (the part before `.supabase.co`)

### 2. Verify Google Cloud Console Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID (the one you created for ShikshAq)
4. Click to edit it
5. **Check the Authorized redirect URIs** - it should have EXACTLY:
   ```
   https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   Replace `YOUR_PROJECT_REF` with your actual project reference from Step 1.

   **Example:**
   ```
   https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback
   ```

6. **IMPORTANT**: 
   - ✅ DO include the Supabase callback URL
   - ❌ DO NOT add `https://shikshaq.vercel.app` directly
   - ❌ DO NOT add `https://shikshaq.vercel.app/auth`
   - ❌ DO NOT add `http://localhost:8080` (unless you're testing locally)

7. Click **Save**

### 3. Verify Supabase Settings

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **Auth**

#### Site URL
Should be:
```
https://shikshaq.vercel.app
```

#### Redirect URLs
Should include (add both if not present):
```
https://shikshaq.vercel.app/**
http://localhost:8080/**
```

4. Click **Save**

### 4. Verify Supabase Google Provider Settings

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list
3. Make sure it's **Enabled** (toggle should be ON)
4. Verify **Client ID** and **Client Secret** are filled in
5. Click **Save** if you made any changes

### 5. Check Supabase Redirect URL

The redirect URL shown in Supabase should be:
```
https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
```

This should **exactly match** what you have in Google Cloud Console.

## Common Mistakes

### ❌ Wrong: Adding Vercel URL to Google Cloud Console
```
https://shikshaq.vercel.app/auth  ← WRONG!
```

### ✅ Correct: Only Supabase callback URL in Google Cloud Console
```
https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback  ← CORRECT!
```

### ❌ Wrong: Missing wildcard in Supabase Redirect URLs
```
https://shikshaq.vercel.app  ← Missing /**
```

### ✅ Correct: With wildcard in Supabase Redirect URLs
```
https://shikshaq.vercel.app/**  ← CORRECT!
```

## How OAuth Flow Works

1. User clicks "Sign in with Google" on `https://shikshaq.vercel.app/auth`
2. App redirects to Google for authentication
3. Google redirects to: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback` (this must match Google Cloud Console)
4. Supabase processes the auth token
5. Supabase redirects back to: `https://shikshaq.vercel.app` (using Site URL/Redirect URLs)

## Quick Checklist

- [ ] Google Cloud Console has ONLY: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- [ ] Supabase Site URL is: `https://shikshaq.vercel.app`
- [ ] Supabase Redirect URLs includes: `https://shikshaq.vercel.app/**`
- [ ] Google provider is enabled in Supabase
- [ ] Client ID and Secret are saved in Supabase
- [ ] The redirect URL in Supabase matches Google Cloud Console exactly

## Still Getting 404?

1. **Double-check the exact URL** in Google Cloud Console - copy it exactly from Supabase
2. **Clear browser cache** and try again
3. **Check Supabase Logs**: Go to Supabase Dashboard → Logs → API Logs to see the exact error
4. **Verify the project reference** - make sure you're using the correct Supabase project

## Test After Fixing

1. Go to `https://shikshaq.vercel.app/auth`
2. Click "Continue with Google"
3. Sign in with Google
4. You should be redirected back to `https://shikshaq.vercel.app` (home page)

If you still get a 404, check the browser console (F12) for the exact error message and verify the redirect URL matches exactly.

