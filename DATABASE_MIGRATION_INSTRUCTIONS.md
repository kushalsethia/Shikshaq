# Database Migration Instructions

## Migration: Add user_id to teacher_recommendations

Since we updated the recommendation form to require sign-in, we need to add the `user_id` column to track which user submitted each recommendation.

## Quick Migration (Copy & Paste)

Copy and paste this SQL into your Supabase SQL Editor:

```sql
-- Add user_id column to teacher_recommendations table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'teacher_recommendations' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.teacher_recommendations 
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    
    -- Create index for faster queries
    CREATE INDEX IF NOT EXISTS teacher_recommendations_user_id_idx 
    ON public.teacher_recommendations(user_id);
  END IF;
END $$;

-- Update the INSERT policy to require authentication
DROP POLICY IF EXISTS "Anyone can submit teacher recommendations" ON public.teacher_recommendations;
DROP POLICY IF EXISTS "Authenticated users can submit teacher recommendations" ON public.teacher_recommendations;

CREATE POLICY "Authenticated users can submit teacher recommendations"
  ON public.teacher_recommendations
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

## Step-by-Step Instructions

1. **Go to Supabase Dashboard**
   - Navigate to your project
   - Click on **SQL Editor** in the left sidebar

2. **Create New Query**
   - Click **New Query**

3. **Paste the SQL**
   - Copy the SQL above
   - Paste it into the query editor

4. **Run the Query**
   - Click **Run** (or press Cmd/Ctrl + Enter)
   - You should see "Success. No rows returned"

5. **Verify the Column Was Added**
   - Go to **Table Editor**
   - Select `teacher_recommendations` table
   - Check that `user_id` column exists

## What This Does

- ✅ Adds `user_id` column (nullable, references auth.users)
- ✅ Creates an index for faster queries
- ✅ Updates RLS policy to require authentication for submissions
- ✅ Safe to run multiple times (won't error if column already exists)

## After Migration

Once you run this migration:
- The recommendation form will store the `user_id` of the person who submitted it
- Only signed-in users can submit recommendations
- You can track which users recommended which teachers

## Troubleshooting

**Error: "column user_id already exists"**
- This means the column was already added
- The migration is safe to run - it checks if the column exists first

**Error: "relation teacher_recommendations does not exist"**
- You need to run the initial migration first
- Run `20250121000000_create_teacher_recommendations.sql` first

