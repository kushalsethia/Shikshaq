# Admin Panel Setup Guide

## Admin Password Protection

The admin panel at `/admin/recommendations` is protected by a password stored in an environment variable (secure and not committed to git).

### Setting Up the Admin Password

**⚠️ IMPORTANT:** The password is stored in an environment variable, NOT in the code!

### Step 1: Create `.env.local` File

1. In your project root, create a file named `.env.local`
2. Add this line:
   ```
   VITE_ADMIN_PASSWORD=your_secure_password_here
   ```
3. Replace `your_secure_password_here` with your actual secure password
4. Save the file

**Example:**
```
VITE_ADMIN_PASSWORD=MySecurePassword123!
```

### Step 2: Verify `.env.local` is in `.gitignore`

The `.env.local` file should already be in `.gitignore` (it's there by default), so it won't be committed to GitHub.

### Step 3: Restart Your Dev Server

After creating `.env.local`, restart your development server:
```bash
npm run dev
```

### Step 4: Set Password in Production (Vercel)

When deploying to Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add a new variable:
   - **Name:** `VITE_ADMIN_PASSWORD`
   - **Value:** Your secure password
   - **Environment:** Production, Preview, Development (select all)
3. Save and redeploy

### How It Works

- When someone visits `/admin/recommendations`, they see a password prompt
- The password is checked client-side (in the browser)
- If correct, access is granted and stored in `sessionStorage` for the current browser session
- When the browser is closed, the session expires

### Security Notes

**Current Implementation (Environment Variable):**
- ✅ Password stored in `.env.local` (not committed to git)
- ✅ Secure - password not visible in source code
- ✅ Easy to change without code changes
- ✅ Works in development and production
- ⚠️ Still client-side only (password visible in browser after login)
- ⚠️ For maximum security, consider server-side authentication

**For Production, Consider:**
1. **Environment Variables** - Store password in `.env` file (not committed to git)
2. **Database-based Admin System** - Create an `admins` table with user IDs
3. **Role-based Access** - Add a `role` field to user profiles
4. **Supabase RLS Policies** - Restrict access at database level

### Who is the Admin?

Currently, **anyone with the password** can access the admin panel. There's no specific "admin user" - it's password-based.

### Recommended: Create Admin Users Table

If you want to restrict admin access to specific users, you can:

1. Create an `admins` table in Supabase:
   ```sql
   CREATE TABLE public.admins (
     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );
   ```

2. Add your user ID to the table via Supabase Dashboard

3. Update the admin page to check if the logged-in user is in the `admins` table

Would you like me to implement a user-based admin system instead?

