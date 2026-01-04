# Teacher Recommendations Setup Guide

## Step 1: Run the Migration

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/20250121000000_create_teacher_recommendations.sql`
4. Click **Run** to execute the migration

This will create:
- `teacher_recommendations` table
- RLS policies (anyone can submit, authenticated users can view)
- Indexes for performance
- Auto-update trigger for `updated_at` field

## Step 2: Verify the Table

After running the migration, verify the table was created:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see `teacher_recommendations` table
3. Check that it has these columns:
   - `id` (UUID, primary key)
   - `recommender_name` (text)
   - `recommender_contact` (text)
   - `teacher_name` (text)
   - `teacher_contact` (text)
   - `status` (text, default: 'pending')
   - `notes` (text, nullable)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

## Step 3: Test the Form

1. Go to your website
2. Navigate to the "Recommend a Teacher" form
3. Fill out and submit the form
4. Check Supabase Dashboard → Table Editor → `teacher_recommendations`
5. You should see the new recommendation

## Step 4: View Recommendations

### Option A: View in Supabase Dashboard (Easiest)
1. Go to Supabase Dashboard → Table Editor
2. Select `teacher_recommendations` table
3. View all recommendations with filters and sorting

### Option B: Use the Admin Page (Recommended)
1. Navigate to `/admin/recommendations` on your website
2. View all recommendations in a nice table format
3. Update status and add notes

## RLS Policy Notes

**Current Setup:**
- ✅ **Anyone can submit** recommendations (public form)
- ✅ **Authenticated users can view** recommendations
- ❌ **No one can update/delete** via client (use Supabase Dashboard or service role)

**To restrict viewing to admins only:**
1. Create a `user_roles` table or add a `role` field to `profiles`
2. Update the SELECT policy to check for admin role
3. Or use service role key for admin operations

## Status Values

- `pending` - New recommendation, not yet contacted
- `contacted` - Teacher has been contacted
- `onboarded` - Teacher has joined the platform
- `rejected` - Recommendation was not suitable

## Next Steps

1. Run the migration
2. Test the form submission
3. Set up email notifications (optional) - get notified when new recommendations come in
4. Create admin dashboard (optional) - use the admin page route

