# Teacher Onboarding System Plan

## Overview
Replace Google Form with an internal onboarding form that requires admin approval before creating teacher profiles.

## Database Changes

### 1. Add MOU Column to Shikshaqmine
- Add `MOU` BOOLEAN column (default: true)
- Set all existing teachers to `MOU = true`

### 2. Create teacher_applications Table
Stores pending applications before approval:
```sql
CREATE TABLE teacher_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Basic Info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  sir_maam TEXT NOT NULL CHECK (sir_maam IN ('Sir', "Ma'am")),
  
  -- Teaching Details
  subjects TEXT NOT NULL, -- Comma-separated
  classes_taught_for_backend TEXT NOT NULL, -- Comma-separated numbers
  school_boards_catered TEXT, -- Comma-separated
  location_v2 TEXT,
  students_home_areas TEXT, -- Comma-separated
  tutors_home_areas TEXT, -- Comma-separated
  mode_of_teaching TEXT, -- Comma-separated: Online, Offline
  class_size TEXT, -- Comma-separated: Group, Solo
  
  -- Additional Info
  description TEXT,
  qualifications_etc TEXT,
  years_started_teaching TEXT,
  featured_subject TEXT,
  whatsapp_link TEXT,
  hero_image_url TEXT,
  
  -- MOU Consent
  mou_consent BOOLEAN NOT NULL DEFAULT false,
  mou_consent_timestamp TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### 3. Slug Generation Function
```sql
CREATE OR REPLACE FUNCTION generate_unique_slug(name_text TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate base slug: lowercase, replace non-alphanumeric with hyphens
  base_slug := LOWER(REGEXP_REPLACE(TRIM(name_text), '[^a-zA-Z0-9]+', '-', 'g'));
  -- Remove leading/trailing hyphens
  base_slug := TRIM(BOTH '-' FROM base_slug);
  
  final_slug := base_slug;
  
  -- Check if slug exists, append number if needed
  WHILE EXISTS (
    SELECT 1 FROM public."Shikshaqmine" WHERE "Slug" = final_slug
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;
```

### 4. Approve Application Function
```sql
CREATE OR REPLACE FUNCTION approve_teacher_application(application_id UUID, admin_id UUID)
RETURNS UUID -- Returns the created Shikshaqmine ID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  app_record RECORD;
  generated_slug TEXT;
  shikshaqmine_id INTEGER;
BEGIN
  -- Fetch application
  SELECT * INTO app_record
  FROM teacher_applications
  WHERE id = application_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found or already processed';
  END IF;
  
  -- Generate unique slug
  generated_slug := generate_unique_slug(app_record.name);
  
  -- Insert into Shikshaqmine
  INSERT INTO public."Shikshaqmine" (
    "Title",
    "Slug",
    "Email ID",
    "Phone Number",
    "Sir/Ma'am?",
    "Subjects",
    "Classes Taught for Backend",
    "School Boards Catered",
    "LOCATION V2",
    "STUDENT'S HOME IN THESE AREAS",
    "TUTOR'S HOME IN THESE AREAS",
    "Mode of Teaching",
    "Class Size (Group/ Solo)",
    "Description",
    "Qualifications etc",
    "Years they started teaching",
    "Featured Subject",
    "Link",
    "Hero Image",
    "MOU"
  )
  VALUES (
    app_record.name,
    generated_slug,
    app_record.email,
    app_record.phone_number,
    app_record.sir_maam,
    app_record.subjects,
    app_record.classes_taught_for_backend,
    app_record.school_boards_catered,
    app_record.location_v2,
    app_record.students_home_areas,
    app_record.tutors_home_areas,
    app_record.mode_of_teaching,
    app_record.class_size,
    app_record.description,
    app_record.qualifications_etc,
    app_record.years_started_teaching,
    app_record.featured_subject,
    app_record.whatsapp_link,
    app_record.hero_image_url,
    true -- MOU consent was required to submit
  )
  RETURNING id INTO shikshaqmine_id;
  
  -- Update application status
  UPDATE teacher_applications
  SET 
    status = 'approved',
    reviewed_by = admin_id,
    reviewed_at = now(),
    updated_at = now()
  WHERE id = application_id;
  
  RETURN shikshaqmine_id;
END;
$$;
```

## Frontend Changes

### 1. Onboarding Form Page (`/join`)
**Required Fields:**
- Name (Title)
- Email ID
- Phone Number
- Sir/Ma'am? (dropdown)
- Subjects (multi-select checkboxes)
- Classes Taught for Backend (multi-select checkboxes: 1-12, UG)
- School Boards Catered (multi-select checkboxes)
- Location V2 (dropdown: TEACHER'S HOME TUTORING, STUDENT'S HOME TUTORING ONLY, BOTH OPTIONS LISTED)
- Student's Home in These Areas (multi-select checkboxes)
- Tutor's Home in These Areas (multi-select checkboxes)
- Mode of Teaching (multi-select: Online, Offline)
- Class Size (multi-select: Group, Solo)
- Description
- Qualifications etc
- Years they started teaching
- Featured Subject (dropdown from subjects list)
- WhatsApp Link
- Hero Image (file upload with compression)

**MOU Section:**
- Display the MOU text
- Two radio buttons:
  - "I consent" (required to submit)
  - "I do not consent" (disables submit)

**Form Submission:**
- Validate all required fields
- Validate MOU consent = true
- Upload hero image to Supabase storage
- Insert into `teacher_applications` table
- Show success message: "Your application has been submitted and is pending admin review. We'll notify you once it's approved."

### 2. Admin Approval Page (`/admin/teacher-applications`)
**Features:**
- List all pending applications
- View application details
- Approve button → calls `approve_teacher_application()` function
- Reject button → updates status to 'rejected' with optional reason
- Filter by status (pending, approved, rejected)
- Show application date, applicant email, phone

**Approval Flow:**
1. Admin clicks "Approve"
2. Function generates unique slug
3. Creates entry in Shikshaqmine
4. Triggers sync to teachers_list (existing trigger)
5. Updates application status
6. Shows success message

## Implementation Steps

1. ✅ Create database migration for MOU column
2. ✅ Create database migration for teacher_applications table
3. ✅ Create slug generation function
4. ✅ Create approval function
5. ✅ Create onboarding form page
6. ✅ Create admin approval page
7. ✅ Add route for admin page
8. ✅ Update Join page to show form instead of Google Form link
9. ✅ Test end-to-end flow

## RLS Policies

### teacher_applications table:
- **Public can insert** (for form submissions)
- **Admins can view all** applications
- **Admins can update** applications (approve/reject)
- **Users can view own** applications (by email match)

## Notes

- Slug uniqueness is guaranteed by the function
- Existing teachers get MOU = true automatically
- Hero image upload uses same compression as teacher dashboard
- Area field auto-computed from Student's/Tutor's Home Areas (existing trigger)
- Classes Taught auto-converted to Roman numerals (existing logic)

