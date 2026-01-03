# Liked Teachers Feature Setup

## Overview

The liked teachers feature allows users to:
- Like/unlike teachers from the Browse page and Teacher Profile page
- View all their liked teachers in a dedicated page
- Access liked teachers from the profile dropdown menu

## Supabase Setup Required

### Step 1: Run the Migration

You need to run the migration file to create the `liked_teachers` table:

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Create a new query
5. Copy and paste the contents of `supabase/migrations/20250120000000_create_liked_teachers.sql`
6. Click **Run**

Alternatively, if you're using Supabase CLI:
```bash
supabase db push
```

### Step 2: Verify the Table

After running the migration, verify:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see a new table called `liked_teachers` with:
   - `id` (UUID, primary key)
   - `user_id` (UUID, references auth.users)
   - `teacher_id` (UUID, references teachers_list)
   - `created_at` (timestamp)

### Step 3: Verify RLS Policies

The migration creates Row Level Security (RLS) policies that:
- Allow users to view only their own likes
- Allow users to insert only their own likes
- Allow users to delete only their own likes

These should be automatically created. You can verify in:
**Authentication** → **Policies** → Select `liked_teachers` table

## Features Implemented

### 1. Heart Icon on Teacher Cards
- Located in the top-right corner of each teacher card
- Filled red when liked, outline when not liked
- Clicking requires login (redirects to auth if not logged in)

### 2. Heart Icon on Teacher Profile
- Located next to the verified badge
- Same behavior as on teacher cards

### 3. Liked Teachers Page
- Accessible from profile dropdown menu
- Shows all teachers the user has liked
- Displays empty state if no teachers are liked

### 4. Profile Dropdown Menu
- Added "Liked Teachers" link in the dropdown
- Only visible when user is logged in

## How It Works

1. **User clicks heart icon** → Checks if user is logged in
2. **If not logged in** → Redirects to `/auth`
3. **If logged in** → Toggles like status in `liked_teachers` table
4. **Heart updates** → Visual feedback (filled/outline)
5. **Toast notification** → Confirms action

## Database Schema

```sql
liked_teachers
├── id (UUID, primary key)
├── user_id (UUID, foreign key → auth.users)
├── teacher_id (UUID, foreign key → teachers_list)
├── created_at (timestamp)
└── UNIQUE constraint on (user_id, teacher_id)
```

## Security

- RLS is enabled on the `liked_teachers` table
- Users can only see/modify their own likes
- All operations require authentication
- Foreign key constraints ensure data integrity

## Testing

1. **Test like functionality**:
   - Sign in to your account
   - Go to Browse page
   - Click heart icon on a teacher card
   - Heart should fill red
   - Go to Teacher Profile page
   - Heart should also be filled there

2. **Test unlike functionality**:
   - Click the filled heart
   - Heart should become outline
   - Teacher should be removed from liked list

3. **Test liked teachers page**:
   - Click profile picture → "Liked Teachers"
   - Should see all liked teachers
   - Should be able to unlike from there

4. **Test without login**:
   - Sign out
   - Try to click heart icon
   - Should redirect to auth page

## Troubleshooting

### Issue: "relation 'liked_teachers' does not exist"
**Solution**: Run the migration file in Supabase SQL Editor

### Issue: "permission denied for table liked_teachers"
**Solution**: Check that RLS policies are created correctly

### Issue: Heart icon doesn't update
**Solution**: 
- Check browser console for errors
- Verify user is logged in
- Check Supabase logs for database errors

### Issue: Can't see liked teachers
**Solution**:
- Verify migration was run successfully
- Check that user_id matches your auth user id
- Check RLS policies allow SELECT

## Notes

- The feature uses Supabase's built-in authentication
- Likes are stored per user account
- Each user can like a teacher only once (enforced by UNIQUE constraint)
- Likes persist across sessions
- The feature works on both Browse and Teacher Profile pages

