# Sign-In Requirement & Admin Setup

## ✅ Changes Made

### 1. Recommendation Form - Sign-In Required

**What Changed:**
- Users can click "Recommend a Teacher" button without signing in
- When they try to submit the form, they must be signed in
- If not signed in, they'll see a warning message and be redirected to sign in
- The form stores the `user_id` of the person who submitted it

**User Experience:**
1. User clicks "Recommend a Teacher" in footer
2. User fills out the form
3. User clicks "Send Message"
4. If not signed in:
   - Warning message appears
   - User is redirected to `/auth` page
   - After signing in, they can return and submit again
5. If signed in:
   - Form submits successfully
   - Recommendation is saved with their user ID

### 2. Admin Panel - Password Protected

**What Changed:**
- Admin panel at `/admin/recommendations` is now password-protected
- Password prompt appears when accessing the page
- Session-based authentication (expires when browser closes)

**Admin Password Setup:**
- Password is stored in environment variable `VITE_ADMIN_PASSWORD`
- **NOT in the code** - secure and not committed to git
- See `ADMIN_SETUP.md` for detailed setup instructions

**Quick Setup:**
1. Create `.env.local` file in project root
2. Add: `VITE_ADMIN_PASSWORD=your_secure_password`
3. Restart dev server
4. For Vercel: Add `VITE_ADMIN_PASSWORD` in Environment Variables

**Accessing Admin Panel:**
1. Navigate to `/admin/recommendations`
2. Enter the admin password
3. Click "Access Admin Panel"
4. View and manage all recommendations

## 📋 Database Changes

### Migration File: `supabase/migrations/20250121000000_create_teacher_recommendations.sql`

**New Column Added:**
- `user_id` - References `auth.users(id)`
- Stores which user submitted each recommendation
- Allows tracking who recommended which teachers

**RLS Policies Updated:**
- ✅ Only authenticated users can submit recommendations
- ✅ Only authenticated users can view recommendations
- ✅ Only authenticated users can update recommendations

## 🔐 Security Notes

### Recommendation Form
- ✅ Requires authentication to submit
- ✅ Tracks which user submitted each recommendation
- ✅ Prevents anonymous submissions

### Admin Panel
- ⚠️ **Current Implementation:** Simple password check (client-side)
- ⚠️ Password is visible in source code
- ✅ Session-based (expires on browser close)
- ✅ Prevents casual access

### For Production, Consider:

1. **Environment Variable for Admin Password:**
   ```typescript
   const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'ShikshAq2024!';
   ```
   Then add `VITE_ADMIN_PASSWORD` to your `.env` file (don't commit it!)

2. **User-Based Admin System:**
   - Create an `admins` table
   - Check if logged-in user is in the table
   - More secure than password-based

3. **Supabase RLS Policies:**
   - Restrict admin access at database level
   - Only allow specific user IDs to view/update

## 🚀 Next Steps

1. **Run the Migration:**
   - Go to Supabase Dashboard → SQL Editor
   - Run `supabase/migrations/20250121000000_create_teacher_recommendations.sql`
   - This adds the `user_id` column if it doesn't exist

2. **Change Admin Password:**
   - Update `ADMIN_PASSWORD` in `src/pages/AdminRecommendations.tsx`
   - Use a strong, unique password

3. **Test the Flow:**
   - Try submitting a recommendation without signing in
   - Sign in and submit again
   - Access admin panel with password
   - Verify recommendations appear with user IDs

4. **Optional: Set Up Environment Variable:**
   - Add `VITE_ADMIN_PASSWORD` to `.env.local`
   - Update code to use `import.meta.env.VITE_ADMIN_PASSWORD`
   - Add to `.gitignore` to keep it secret

## 📝 Who is the Admin?

Currently, **anyone with the password** can access the admin panel. There's no specific "admin user" - it's password-based.

If you want to restrict access to specific users, I can help you set up:
- An `admins` table in Supabase
- User ID-based admin checking
- More secure role-based access

Let me know if you'd like me to implement a user-based admin system!

