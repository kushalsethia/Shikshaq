# Debugging 404 Error for liked_teachers

## Common Causes

Since you already have the `liked_teachers` table, the 404 error is likely due to one of these issues:

### 1. RLS Policies Not Set Up Correctly

**Check:**
1. Go to Supabase Dashboard → **Authentication** → **Policies**
2. Select the `liked_teachers` table
3. Verify you have these policies:
   - **SELECT**: "Users can view their own likes" - `auth.uid() = user_id`
   - **INSERT**: "Users can insert their own likes" - `auth.uid() = user_id`
   - **DELETE**: "Users can delete their own likes" - `auth.uid() = user_id`

**Fix:**
If policies are missing, run this SQL in Supabase SQL Editor:

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own likes" ON public.liked_teachers;
DROP POLICY IF EXISTS "Users can insert their own likes" ON public.liked_teachers;
DROP POLICY IF EXISTS "Users can delete their own likes" ON public.liked_teachers;

-- Create policies
CREATE POLICY "Users can view their own likes"
  ON public.liked_teachers
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own likes"
  ON public.liked_teachers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON public.liked_teachers
  FOR DELETE
  USING (auth.uid() = user_id);
```

### 2. Table in Wrong Schema

**Check:**
1. Go to Supabase Dashboard → **Table Editor**
2. Make sure `liked_teachers` is in the `public` schema (not `auth` or another schema)

**Fix:**
If the table is in a different schema, you may need to:
- Move it to `public` schema, OR
- Update the code to reference the correct schema

### 3. User Not Authenticated

**Check:**
- Open browser console (F12)
- Check if you're logged in
- The error might occur if `user.id` is null or undefined

**Fix:**
- Make sure you're signed in before trying to like teachers
- Check that `auth.uid()` returns a valid UUID

### 4. Table Name Mismatch

**Check:**
- Verify the table is exactly named `liked_teachers` (case-sensitive in some databases)
- Check for typos: `liked_teacher` vs `liked_teachers`

**Fix:**
- In Supabase Dashboard → Table Editor, verify the exact table name
- Update the code if there's a mismatch

## How to Debug

1. **Open Browser Console** (F12)
2. **Try to like a teacher**
3. **Check the console logs** - you should see detailed error information including:
   - Error code
   - Error message
   - Details and hints

4. **Check Supabase Logs**:
   - Go to Supabase Dashboard → **Logs** → **API Logs**
   - Look for the 404 error
   - Check the request details

5. **Test the Table Directly**:
   Run this in Supabase SQL Editor (while logged in as a user):
   ```sql
   -- Test if you can read from the table
   SELECT * FROM public.liked_teachers WHERE user_id = auth.uid();
   
   -- Test if you can insert
   INSERT INTO public.liked_teachers (user_id, teacher_id)
   VALUES (auth.uid(), 'some-teacher-id-here')
   ON CONFLICT (user_id, teacher_id) DO NOTHING;
   ```

## Quick Fix Checklist

- [ ] RLS is enabled on `liked_teachers` table
- [ ] SELECT policy exists and uses `auth.uid() = user_id`
- [ ] INSERT policy exists and uses `auth.uid() = user_id`
- [ ] DELETE policy exists and uses `auth.uid() = user_id`
- [ ] Table is in `public` schema
- [ ] Table name is exactly `liked_teachers`
- [ ] User is authenticated when trying to like
- [ ] Foreign key constraints are correct (user_id → auth.users, teacher_id → teachers_list)

## Still Having Issues?

1. Check the browser console for the full error details
2. Check Supabase Dashboard → Logs → API Logs for server-side errors
3. Verify your user is authenticated: `auth.uid()` should return a UUID
4. Test the table directly in Supabase SQL Editor with your user ID

