# Vercel OAuth Configuration Verification

## Your Current Configuration ✅

- **Site URL**: `https://shikshaq.vercel.app`
- **Redirect URLs**: `https://shikshaq.vercel.app/**`
- **Authorization Path**: `/oauth/consent` (Vercel internal)

## Verification Steps

### 1. Verify Supabase Settings Are Saved

1. Go to Supabase Dashboard → Settings → Auth
2. Check that **Site URL** shows: `https://shikshaq.vercel.app`
3. Check that **Redirect URLs** shows: `https://shikshaq.vercel.app/**`
4. **Important**: Click **Save** even if values look correct (forces a refresh)
5. Wait 30-60 seconds for changes to propagate

### 2. Verify Google Cloud Console

The redirect URI in Google Cloud Console should be:
```
https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback
```

**NOT** `https://shikshaq.vercel.app` or any Vercel URL.

### 3. Check Vercel Environment Variables

Make sure your Vercel deployment has these environment variables:
- `VITE_SUPABASE_URL` = `https://uvtifolnsneitetzohtn.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = (your publishable key)

To check:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify both variables exist
3. If missing, add them and **redeploy**

### 4. Understanding the OAuth Flow

```
1. User clicks "Sign in with Google" on https://shikshaq.vercel.app/auth
2. App calls: supabase.auth.signInWithOAuth({ redirectTo: 'https://shikshaq.vercel.app/auth' })
3. Supabase redirects to Google
4. Google redirects to: https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback
5. Supabase processes token
6. Supabase redirects to: https://shikshaq.vercel.app/auth#access_token=...
7. Your app processes the hash and redirects to home
```

The `/oauth/consent` path you mentioned is likely Vercel's internal OAuth handling, not part of your app's flow.

### 5. Common Issues with Correct Configuration

Even with correct settings, you might still get 404 if:

#### Issue A: Changes Not Propagated
**Fix**: Wait 1-2 minutes after saving Supabase settings, then try again

#### Issue B: Browser Cache
**Fix**: 
- Clear browser cache
- Try incognito/private window
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

#### Issue C: Vercel Deployment Not Updated
**Fix**: 
- Check if latest code is deployed
- Trigger a new deployment if needed
- Verify environment variables are set

#### Issue D: Supabase Project Mismatch
**Fix**: 
- Verify you're editing the correct Supabase project
- Check that the project reference matches: `uvtifolnsneitetzohtn`

### 6. Debug Steps

1. **Check Browser Console** (F12):
   - Look for any errors when clicking "Sign in with Google"
   - Check Network tab for failed requests

2. **Check Supabase Logs**:
   - Go to Supabase Dashboard → Logs → API Logs
   - Look for 404 errors around the time you tried to sign in
   - This will show the exact URL that failed

3. **Test the Callback URL Directly**:
   - Try visiting: `https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback`
   - You should see a Supabase page (not a 404)
   - If you see 404, there's a Supabase configuration issue

4. **Verify OAuth Provider is Enabled**:
   - Supabase Dashboard → Authentication → Providers
   - Google should be **Enabled** (toggle ON)
   - Client ID and Secret should be filled

### 7. If Still Getting 404

Try this test:
1. Temporarily change `redirectTo` to just the home page:
   ```typescript
   redirectTo: `${window.location.origin}/`
   ```
2. Deploy to Vercel
3. Try signing in
4. If this works, the issue is with the `/auth` path specifically
5. If this also fails, the issue is with the Redirect URLs configuration

## Quick Checklist

- [ ] Supabase Site URL: `https://shikshaq.vercel.app`
- [ ] Supabase Redirect URLs: `https://shikshaq.vercel.app/**` (with `/**`)
- [ ] Clicked Save in Supabase after verifying
- [ ] Waited 1-2 minutes for propagation
- [ ] Google Cloud Console has: `https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback`
- [ ] Google provider enabled in Supabase
- [ ] Vercel environment variables are set
- [ ] Cleared browser cache
- [ ] Tried in incognito window

## Next Steps

If everything above is correct and you still get 404:
1. Check Supabase API Logs for the exact error
2. Share the error details from the logs
3. Verify the exact URL that's failing (from browser Network tab)

