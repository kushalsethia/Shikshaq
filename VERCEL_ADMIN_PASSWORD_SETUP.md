# Vercel Environment Variable Setup for Admin Panel

## Issue

The admin panel at `/admin/recommendations` is not working on Vercel because the `VITE_ADMIN_PASSWORD` environment variable is not set.

## Solution: Add Environment Variable to Vercel

### Step 1: Go to Vercel Dashboard

1. Navigate to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`shikshaq`)
3. Go to **Settings** → **Environment Variables**

### Step 2: Add the Admin Password

1. Click **Add New**
2. Fill in:
   - **Name:** `VITE_ADMIN_PASSWORD`
   - **Value:** `Kushal123` (or your chosen password)
   - **Environment:** Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Click **Save**

### Step 3: Redeploy

After adding the environment variable, you need to redeploy:

1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic redeployment

### Step 4: Verify

1. Wait for deployment to complete
2. Visit `https://shikshaq.vercel.app/admin/recommendations`
3. You should see the password prompt
4. Enter your password (`Kushal123`)

## Alternative: Quick Redeploy via Git

If you want to trigger a redeploy without making code changes:

```bash
# Make a small change (like adding a comment)
# Or just push an empty commit
git commit --allow-empty -m "Trigger redeploy for env vars"
git push
```

## Troubleshooting

### Still Not Working?

1. **Check Environment Variable:**
   - Go to Vercel → Settings → Environment Variables
   - Verify `VITE_ADMIN_PASSWORD` exists
   - Verify it's set for the correct environment (Production/Preview/Development)

2. **Check Deployment:**
   - Go to Deployments tab
   - Check the latest deployment logs
   - Look for any errors related to environment variables

3. **Clear Browser Cache:**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Or clear browser cache

4. **Verify Route:**
   - The correct URL is: `https://shikshaq.vercel.app/admin/recommendations`
   - `/admin/` will redirect to `/admin/recommendations`

## Security Note

- The password is stored securely in Vercel's environment variables
- It's not visible in the code or GitHub
- Only you (and anyone with Vercel access) can see it
- You can change it anytime in Vercel settings

