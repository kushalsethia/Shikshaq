# Teacher Dashboard & Onboarding System - Implementation Plan

## Overview

Build a complete teacher role system with:
1. **Auto-role assignment** - Match existing teachers by email
2. **Teacher Dashboard** - Similar to Student/Guardian dashboards
3. **Onboarding Form** - Public form for new teachers to apply

---

## Phase 1: Auto-Role Assignment System

### Goal
When a teacher logs in with an email that matches a teacher in `Shikshaqmine`, automatically assign them the "teacher" role.

### Implementation Steps

#### 1.1 Create Database Migration
**File:** `supabase/migrations/[timestamp]_auto_assign_teacher_role.sql`

```sql
-- Function to auto-assign teacher role based on email match
CREATE OR REPLACE FUNCTION auto_assign_teacher_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_teacher_email TEXT;
  v_user_email TEXT;
BEGIN
  -- Get user's email from auth.users
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = NEW.id;
  
  -- Check if email exists in Shikshaqmine table
  IF v_user_email IS NOT NULL THEN
    SELECT "Email ID" INTO v_teacher_email
    FROM public."Shikshaqmine"
    WHERE LOWER(TRIM("Email ID")) = LOWER(TRIM(v_user_email))
    LIMIT 1;
    
    -- If email matches, assign teacher role
    IF v_teacher_email IS NOT NULL THEN
      -- Update or insert profile with teacher role
      INSERT INTO public.profiles (id, role, email, full_name, avatar_url)
      VALUES (
        NEW.id,
        'teacher',
        v_user_email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
      )
      ON CONFLICT (id) 
      DO UPDATE SET 
        role = 'teacher',
        email = v_user_email,
        updated_at = now();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created_assign_teacher_role ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_teacher_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_teacher_role();

-- Also create a function to manually check existing users
CREATE OR REPLACE FUNCTION check_existing_users_for_teacher_role()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_record RECORD;
  v_teacher_email TEXT;
BEGIN
  -- Loop through all users without a role
  FOR v_user_record IN
    SELECT u.id, u.email, u.raw_user_meta_data
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE p.role IS NULL OR p.role NOT IN ('student', 'guardian', 'teacher')
  LOOP
    -- Check if email matches any teacher
    IF v_user_record.email IS NOT NULL THEN
      SELECT "Email ID" INTO v_teacher_email
      FROM public."Shikshaqmine"
      WHERE LOWER(TRIM("Email ID")) = LOWER(TRIM(v_user_record.email))
      LIMIT 1;
      
      -- If match found, assign teacher role
      IF v_teacher_email IS NOT NULL THEN
        INSERT INTO public.profiles (id, role, email, full_name, avatar_url)
        VALUES (
          v_user_record.id,
          'teacher',
          v_user_record.email,
          v_user_record.raw_user_meta_data->>'full_name',
          v_user_record.raw_user_meta_data->>'avatar_url'
        )
        ON CONFLICT (id) 
        DO UPDATE SET 
          role = 'teacher',
          email = v_user_record.email,
          updated_at = now();
      END IF;
    END IF;
  END LOOP;
END;
$$;
```

#### 1.2 Update Role Selection Logic
**File:** `src/pages/SelectRole.tsx`

- Add check: If user already has teacher role (from auto-assignment), skip role selection
- Only show student/guardian options if no role assigned

#### 1.3 Update useRequireRole Hook
**File:** `src/hooks/use-require-role.tsx`

- Add logic to check for teacher role
- Redirect teachers to `/dashboard/teacher` instead of `/select-role`

---

## Phase 2: Teacher Dashboard

### Goal
Create a dashboard where teachers can:
- View their profile information
- See their reviews/comments
- View stats (views, likes, etc.)
- Edit basic information (if needed)

### Implementation Steps

#### 2.1 Create Teacher Dashboard Component
**File:** `src/pages/TeacherDashboard.tsx`

**Structure:**
```typescript
- Profile Overview Section
  - Name, Email, Phone
  - Profile Image
  - Subjects taught
  - Classes taught
  - Areas served
  
- Statistics Section
  - Profile views
  - Number of likes
  - Number of reviews
  
- Reviews Section
  - Display all approved reviews
  - Show pending reviews (if any)
  
- Quick Actions
  - Link to public profile
  - Share profile
```

**Key Features:**
- Fetch teacher data from `Shikshaqmine` table using email match
- Display read-only information (teachers can't edit via dashboard initially)
- Show reviews from `teacher_comments` table
- Display stats from `teacher_likes` table

#### 2.2 Add Route
**File:** `src/App.tsx`

```typescript
<Route path="/dashboard/teacher" element={
  <Suspense fallback={<PageLoader />}>
    <TeacherDashboard />
  </Suspense>
} />
```

#### 2.3 Update Navbar
**File:** `src/components/Navbar.tsx`

- Add "Teacher Dashboard" link in dropdown when user has teacher role
- Similar to how Student/Guardian dashboards are shown

---

## Phase 3: Teacher Onboarding Form

### Goal
Create a public form where new teachers can apply to join the platform.

### Implementation Steps

#### 3.1 Create Onboarding Form Component
**File:** `src/pages/TeacherOnboarding.tsx`

**Form Fields:**
```
Personal Information:
- Full Name *
- Email *
- Phone Number *
- Address

Teaching Details:
- Subjects Taught * (multi-select)
- Classes Taught * (multi-select)
- School Boards * (multi-select)
- Mode of Teaching * (Online/Offline)
- Place of Teaching * (Teacher's place/Student's Home/Both)
- Areas Served * (multi-select)

Additional Information:
- Qualifications
- Years of Experience
- Bio/Description
- Profile Photo (optional)
- WhatsApp Number

Terms & Agreement:
- Agree to terms checkbox *
```

#### 3.2 Create Database Table for Pending Teachers
**File:** `supabase/migrations/[timestamp]_create_teacher_applications.sql`

```sql
-- Table to store teacher applications
CREATE TABLE IF NOT EXISTS public.teacher_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  address TEXT,
  subjects TEXT, -- Comma-separated
  classes_taught TEXT, -- Comma-separated
  school_boards TEXT, -- Comma-separated
  mode_of_teaching TEXT,
  place_of_teaching TEXT,
  areas_served TEXT, -- Comma-separated
  qualifications TEXT,
  years_of_experience INTEGER,
  bio TEXT,
  profile_photo_url TEXT,
  whatsapp_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT, -- Admin notes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (submit application)
CREATE POLICY "Anyone can submit teacher application"
  ON public.teacher_applications FOR INSERT
  WITH CHECK (true);

-- Policy: Admins can view all applications
CREATE POLICY "Admins can view all teacher applications"
  ON public.teacher_applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE id = auth.uid()
    )
  );

-- Policy: Admins can update applications
CREATE POLICY "Admins can update teacher applications"
  ON public.teacher_applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE id = auth.uid()
    )
  );
```

#### 3.3 Create Admin Review Page
**File:** `src/pages/AdminTeacherApplications.tsx`

**Features:**
- List all pending applications
- View application details
- Approve → Creates entry in `Shikshaqmine` table
- Reject → Marks as rejected with optional notes
- Bulk actions

#### 3.4 Add Route
**File:** `src/App.tsx`

```typescript
<Route path="/become-a-teacher" element={
  <Suspense fallback={<PageLoader />}>
    <TeacherOnboarding />
  </Suspense>
} />
<Route path="/admin/teacher-applications" element={
  <Suspense fallback={<PageLoader />}>
    <AdminTeacherApplications />
  </Suspense>
} />
```

---

## Phase 4: Email Matching & Manual Assignment

### Goal
Provide tools to manually assign teacher roles and match emails.

### Implementation Steps

#### 4.1 Create Admin Tool for Email Matching
**File:** `src/pages/AdminTeacherRoleAssignment.tsx`

**Features:**
- List all teachers from `Shikshaqmine` with emails
- Show which emails have accounts
- Show which emails have teacher role assigned
- Manual "Assign Role" button
- Bulk assignment option

#### 4.2 Create SQL Script for Bulk Assignment
**File:** `scripts/assign_teacher_roles.sql`

```sql
-- Script to assign teacher roles to existing users based on email match
-- Run this after collecting teacher emails

UPDATE public.profiles p
SET role = 'teacher'
FROM auth.users u
INNER JOIN public."Shikshaqmine" s
  ON LOWER(TRIM(u.email)) = LOWER(TRIM(s."Email ID"))
WHERE p.id = u.id
  AND (p.role IS NULL OR p.role != 'teacher')
  AND s."Email ID" IS NOT NULL
  AND s."Email ID" != '';
```

---

## Implementation Order

### Step 1: Auto-Role Assignment (Phase 1)
1. Create migration for auto-assignment trigger
2. Update SelectRole component
3. Update useRequireRole hook
4. Test with existing teacher email

### Step 2: Teacher Dashboard (Phase 2)
1. Create TeacherDashboard component
2. Add route
3. Update Navbar
4. Test dashboard access

### Step 3: Onboarding Form (Phase 3)
1. Create teacher_applications table
2. Create TeacherOnboarding form component
3. Create AdminTeacherApplications review page
4. Add routes
5. Test form submission and approval flow

### Step 4: Manual Assignment Tools (Phase 4)
1. Create AdminTeacherRoleAssignment page
2. Create SQL script for bulk assignment
3. Test manual assignment

---

## Database Schema Summary

### Existing Tables (Already Have)
- `profiles` - User profiles with role field
- `Shikshaqmine` - Teacher data with "Email ID" field
- `teacher_comments` - Reviews/comments
- `teacher_likes` - Likes/favorites

### New Tables Needed
- `teacher_applications` - Pending teacher applications

---

## Security Considerations

1. **RLS Policies:**
   - Teachers can only view their own dashboard data
   - Admins can view all teacher applications
   - Public can submit applications

2. **Email Matching:**
   - Case-insensitive matching
   - Trim whitespace
   - Handle NULL emails gracefully

3. **Role Assignment:**
   - Only auto-assign on signup/login
   - Manual override available for admins

---

## Testing Checklist

- [ ] Teacher with matching email auto-gets role on signup
- [ ] Teacher dashboard loads correctly
- [ ] Teacher can see their profile data
- [ ] Teacher can see their reviews
- [ ] Onboarding form submits successfully
- [ ] Admin can review applications
- [ ] Admin can approve/reject applications
- [ ] Approved application creates Shikshaqmine entry
- [ ] Manual role assignment works
- [ ] Bulk role assignment script works

---

## Future Enhancements

1. **Teacher Profile Editing:**
   - Allow teachers to edit some fields
   - Request admin approval for changes

2. **Email Notifications:**
   - Notify teachers when approved
   - Notify admins of new applications

3. **Teacher Analytics:**
   - More detailed stats
   - View trends over time

4. **Teacher Verification:**
   - Verification badge system
   - Document upload for verification

---

## Questions to Consider

1. **Email Collection:**
   - How will you collect emails from 105 existing teachers?
   - Google Form? Email campaign? Manual entry?

2. **Approval Process:**
   - Should all applications require admin approval?
   - Or auto-approve if email matches existing teacher?

3. **Profile Editing:**
   - Should teachers be able to edit their profiles?
   - Or only admins can edit?

4. **Dashboard Access:**
   - Should teachers see analytics?
   - What information is most valuable to them?

---

This plan provides a complete roadmap for implementing the teacher role system. Start with Phase 1 (auto-assignment) as it's the foundation, then build the dashboard and onboarding form.

