# Supabase Setup Instructions

## ✅ What's Been Updated

1. **All queries updated** from `teachers` to `teachers_list` table
2. **Authentication is already configured** and should work
3. **RLS policies migration created** for `teachers_list` table

## 🔧 Required Setup Steps

### 1. Run the RLS Migration

Run this SQL in your Supabase SQL Editor to enable public read access:

```sql
-- Enable RLS on teachers_list if not already enabled
ALTER TABLE public.teachers_list ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can view teachers_list" ON public.teachers_list;

-- Create public read access policy for teachers_list
CREATE POLICY "Anyone can view teachers_list" ON public.teachers_list FOR SELECT USING (true);
```

### 2. Verify Your Table Structure

Make sure your `teachers_list` table has these columns:
- `id` (uuid)
- `name` (text)
- `slug` (text)
- `subject_id` (uuid, nullable) - foreign key to `subjects.id`
- `image_url` (text, nullable)
- `bio` (text, nullable)
- `location` (text, nullable)
- `whatsapp_number` (text, nullable)
- `is_verified` (boolean, default false)
- `is_featured` (boolean, default false)
- `created_at` (timestamp)
- `subjects` (text, nullable) - appears to be a text field
- `classes` (text, nullable)

### 3. Set Up Google OAuth (Optional but Recommended)

To enable Google sign-in:

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Google" provider
3. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Add authorized redirect URL: `https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback`

**To get Google OAuth credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add authorized redirect URI: `https://uvtifolnsneitetzohtn.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret to Supabase

### 4. Email Authentication Setup

Email authentication should work out of the box, but verify:

1. Go to Supabase Dashboard → Authentication → Settings
2. Make sure "Enable email signup" is enabled
3. Configure email templates if needed
4. Set up SMTP for production (optional, uses Supabase default for development)

### 5. Test the Connection

1. Restart your dev server: `npm run dev`
2. Open browser console (F12)
3. Check for any errors
4. Try to sign up/sign in

## 🐛 Troubleshooting

### No Teachers Showing

1. **Check browser console** for errors
2. **Verify RLS policies** are set up correctly (see step 1)
3. **Check table name** - make sure it's `teachers_list` not `teachers`
4. **Verify data exists** - run `SELECT * FROM teachers_list LIMIT 5;` in SQL Editor

### Authentication Not Working

1. **Check environment variables** - make sure `.env` file has correct values
2. **Verify Supabase URL and key** are correct
3. **Check Supabase Dashboard** → Authentication → Settings
4. **For Google OAuth**: Make sure redirect URL is configured correctly

### Relationship Queries Failing

If you see errors about `subjects(name, slug)`, the relationship might not be set up. The code will fallback to fetching subjects separately, but you can also:

1. Verify foreign key exists: `teachers_list.subject_id` → `subjects.id`
2. Check that the relationship is properly defined in Supabase

## 📝 Notes

- The `subjects` field in `teachers_list` appears to be a text field. If you want to use the relationship with `subjects` table, make sure `subject_id` is populated.
- The code handles both relationship queries and fallback queries, so it should work either way.
- All hardcoded images have been removed - images must come from Supabase `image_url` fields.

