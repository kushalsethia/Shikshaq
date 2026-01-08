# Comment Approval System Implementation

## Overview

A comment moderation system has been implemented where all comments require admin approval before being visible to the public. Users can see their own pending comments, but they will be hidden from other users until approved by an admin.

## Database Changes

### Migration File
**File**: `supabase/migrations/20250122000006_add_comment_approval.sql`

This migration adds:
- `approved` (BOOLEAN, default: false) - Approval status
- `approved_by` (UUID, nullable) - ID of admin who approved the comment
- `approved_at` (TIMESTAMP, nullable) - When the comment was approved

### New RLS Policies

1. **Public can view approved comments** - Only approved comments are visible to everyone
2. **Users can view own comments** - Users can see their own pending comments
3. **Admins can view all comments** - Admins can see all comments regardless of approval status
4. **Authenticated users can insert comments** - All new comments are created with `approved = false`
5. **Users can update own comments** - Users can edit their own comments but cannot change approval status
6. **Admins can update all comments** - Admins can approve/reject any comment
7. **Users can delete own comments** - Users can delete their own comments
8. **Admins can delete any comment** - Admins can delete any comment

### Helper Function

- `is_admin()` - Helper function to check if a user is an admin

### Automatic Tracking

A trigger automatically sets `approved_at` and `approved_by` when a comment is approved, and clears them when unapproved.

## Frontend Changes

### 1. TeacherComments Component (`src/components/TeacherComments.tsx`)

**Changes:**
- Updated to fetch only approved comments (or user's own pending comments)
- Shows "Pending Approval" badge for user's own pending comments
- Displays success message when comment is submitted: "Your comment has been submitted and is pending approval"
- New comments are automatically created with `approved = false`

### 2. AdminComments Page (`src/pages/AdminComments.tsx`)

**New Admin Interface:**
- View all pending comments
- View all approved comments
- View all comments (combined)
- Approve comments (sets `approved = true`)
- Reject comments (deletes the comment - you can modify this to mark as "rejected" instead)
- Filter by status (Pending, Approved, All)
- Shows comment author details, teacher name, and timestamp
- Links to teacher profile from each comment

**Features:**
- Displays comment count for each filter tab
- Shows "Pending" or "Approved" badges
- Shows when comment was approved
- Responsive design matching the rest of the application

### 3. Navigation Updates

**Navbar (`src/components/Navbar.tsx`):**
- Added "Comments" link in admin dropdown menu
- Shows alongside "Recommendations" in the admin section

**App Routes (`src/App.tsx`):**
- Added route: `/admin/comments` → `AdminComments` component

## Setup Instructions

### 1. Run Database Migration

Run the migration in your Supabase SQL Editor:

```sql
-- File: supabase/migrations/20250122000006_add_comment_approval.sql
-- Copy and paste the entire file contents into Supabase SQL Editor and execute
```

This will:
- Add the approval columns to `teacher_comments` table
- Create all necessary RLS policies
- Create indexes for better performance
- Set up the approval tracking trigger

### 2. Verify Migration

After running the migration, verify:

```sql
-- Check if columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'teacher_comments'
  AND column_name IN ('approved', 'approved_by', 'approved_at');

-- Check if policies exist
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'teacher_comments';
```

### 3. Test the System

1. **As a regular user:**
   - Sign in and post a comment on a teacher profile
   - You should see "Pending Approval" badge on your comment
   - Your comment should be visible only to you (not to other users)
   - You should see a success message after posting

2. **As an admin:**
   - Sign in with an admin account
   - Navigate to Admin → Comments in the dropdown menu
   - You should see all pending comments
   - Approve a comment - it should appear on the teacher profile
   - Reject a comment - it should be deleted

## How It Works

### Comment Submission Flow

1. User posts a comment → Comment is created with `approved = false`
2. Comment is stored in database but hidden from public view
3. User sees their own comment with "Pending Approval" badge
4. Admin reviews comments in `/admin/comments`
5. Admin approves → `approved = true`, `approved_at` and `approved_by` are set
6. Comment becomes visible to everyone

### Visibility Rules

- **Public users**: Can only see approved comments
- **Comment authors**: Can see their own comments (both pending and approved)
- **Admins**: Can see all comments regardless of approval status

### Admin Actions

- **Approve**: Sets `approved = true`, automatically records approval timestamp and admin ID
- **Reject**: Currently deletes the comment (can be modified to set a "rejected" status instead)

## Future Enhancements (Optional)

1. **Rejection Status**: Instead of deleting rejected comments, you could:
   - Add a `rejected` boolean column
   - Keep rejected comments for review but hide them from public
   - Allow admins to restore rejected comments

2. **Bulk Actions**: 
   - Select multiple comments and approve/reject them at once

3. **Comment Editing by Admins**:
   - Allow admins to edit comment text before approving

4. **Email Notifications**:
   - Notify admins when new comments are submitted
   - Notify users when their comments are approved/rejected

5. **Rejection Reasons**:
   - Allow admins to specify why a comment was rejected
   - Show rejection reason to the comment author

## Troubleshooting

### Comments Not Appearing After Approval

- Check if RLS policies are correctly set up
- Verify that `approved = true` was set in the database
- Check browser console for any errors

### Admins Can't See All Comments

- Verify admin user ID is in the `admins` table
- Check that the "Admins can view all comments" policy exists
- Try refreshing the admin status check

### Users Can't See Their Own Pending Comments

- Verify the "Users can view own comments" policy exists
- Check that `user_id` in comments matches the logged-in user's ID
- Ensure RLS is enabled on the `teacher_comments` table

## Notes

- All existing comments (created before this migration) will default to `approved = false`
- You may want to bulk-approve existing comments if desired
- The system uses soft-delete for rejected comments (they're actually deleted, not marked as rejected)
- Comments maintain referential integrity - if a user or teacher is deleted, related comments are also removed (via CASCADE)

