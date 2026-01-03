# Fixing /oauth/consent 404 Error

## The Issue

The path `/oauth/consent` is showing a 404 because:
1. **It doesn't exist in your app** - Your routes are: `/`, `/auth`, `/browse`, `/teacher/:slug`, etc.
2. **It's not part of the OAuth flow** - Your OAuth should redirect to `/auth`, not `/oauth/consent`

## Understanding the OAuth Flow

Your correct OAuth flow should be:

```
1. User visits: https://shikshaq.vercel.app/auth
2. Clicks "Sign in with Google"
3. Redirects to: Google OAuth consent screen
4. Google redirects to: https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback
5. Supabase processes token
6. Supabase redirects to: https://shikshaq.vercel.app/auth#access_token=...
7. Your app processes the hash and redirects to home
```

**The `/oauth/consent` path is NOT part of this flow.**

## Why You Might Be Seeing /oauth/consent

This could be happening if:

1. **Vercel Preview/Deployment Issue**: Vercel might be trying to handle OAuth at this path
2. **Misconfiguration**: Something is redirecting to the wrong path
3. **Browser Cache**: Old redirect URLs cached

## Solution

### Step 1: Verify Your Code

Your code correctly uses `/auth`:
```typescript
redirectTo: `${window.location.origin}/auth`
```

This is correct ✅

### Step 2: Verify Supabase Redirect URLs

In Supabase Dashboard → Settings → Auth → Redirect URLs:
- Should have: `https://shikshaq.vercel.app/**`
- This allows redirects to ANY path on your domain, including `/auth`

### Step 3: Clear Browser Cache

1. Clear browser cache completely
2. Try in incognito/private window
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Step 4: Check Where /oauth/consent is Coming From

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to sign in with Google
4. Look for any requests to `/oauth/consent`
5. Check the "Initiator" column to see what's making that request

### Step 5: Verify Vercel Configuration

Check if there's a `vercel.json` file or Vercel settings that might be redirecting OAuth:

1. Check your project root for `vercel.json`
2. Check Vercel Dashboard → Settings → Redirects
3. Make sure there are no redirects to `/oauth/consent`

## If /oauth/consent is Being Used

If something is actually trying to use `/oauth/consent`, you have two options:

### Option A: Ignore It (Recommended)

If `/oauth/consent` is just showing 404 in preview but the actual OAuth flow works (redirects to `/auth`), you can ignore it. The 404 is expected since that route doesn't exist.

### Option B: Add a Catch-All Route

If you want to handle any `/oauth/*` paths, you could add a route that redirects to `/auth`:

```typescript
// In App.tsx, add before the catch-all route:
<Route path="/oauth/*" element={<Navigate to="/auth" replace />} />
```

But this is usually unnecessary.

## The Real Issue

The 404 error you're seeing is likely NOT about `/oauth/consent`. The real issue is probably:

1. **Supabase redirect URL configuration** - Make sure `https://shikshaq.vercel.app/**` is in Redirect URLs
2. **Google Cloud Console** - Make sure only the Supabase callback URL is there
3. **Propagation delay** - Wait 1-2 minutes after saving Supabase settings

## Test the Actual OAuth Flow

1. Go to: `https://shikshaq.vercel.app/auth`
2. Click "Continue with Google"
3. Sign in with Google
4. You should be redirected back to: `https://shikshaq.vercel.app/auth#access_token=...`
5. Then automatically redirected to: `https://shikshaq.vercel.app/`

If this flow works, the `/oauth/consent` 404 is irrelevant and can be ignored.

## Summary

- `/oauth/consent` doesn't exist in your app (that's why it 404s)
- Your OAuth flow uses `/auth` (which is correct)
- The 404 on `/oauth/consent` is likely a red herring
- Focus on fixing the actual OAuth redirect configuration in Supabase

