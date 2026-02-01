# Shikshaqmine Table - Column Usage Analysis

## ✅ USED COLUMNS (DO NOT DELETE)

### Core Identification
- **"Slug"** - Used for matching teachers, synced to `teachers_list.slug`
- **"Title"** - Synced to `teachers_list.name`

### Synced to teachers_list
- **"Hero Image"** - Synced to `teachers_list.image_url`
- **"Area"** - Synced to `teachers_list.location` (primary)
- **"LOCATION V2"** - Synced to `teachers_list.location` (fallback)
- **"Link"** - Used to extract WhatsApp number, synced to `teachers_list.whatsapp_number`
- **"Subjects"** - Synced to `teachers_list.subjects`, displayed on profile
- **"Classes Taught"** - Synced to `teachers_list.classes`, displayed on profile
- **"Sir/Ma'am?"** - Synced to `teachers_list."Sir/Ma'am?"`, displayed on profile

### Used in Frontend (TeacherProfile.tsx)
- **"EXPANDED"** - Used in Footer component
- **"Classes Taught for Backend"** - Used in TeacherProfile (classes_taught_for_backend)
- **"School Boards Catered"** - Used in TeacherProfile (boards_taught)
- **"Class Size (Group/ Solo)"** - Used in TeacherProfile (class_size)
- **"Mode of Teaching"** - Used in TeacherProfile (mode_of_teaching)
- **"STUDENT'S HOME IN THESE AREAS"** - Used in TeacherProfile (students_home_areas)
- **"TUTOR'S HOME IN THESE AREAS"** - Used in TeacherProfile (tutors_home_areas)
- **"Description"** - Used in TeacherProfile (description)
- **"Qualifications etc"** - Used in TeacherProfile (qualifications_etc)
- **"Review 1"** - Used in TeacherProfile (review_1)
- **"Review 2"** - Used in TeacherProfile (review_2)
- **"Review 3"** - Used in TeacherProfile (review_3)

### Used in Filtering (Browse.tsx)
- **"Subjects"** - Used for subject filtering
- **"Classes Taught"** - Used for class filtering
- **"School Boards Catered"** - Used for board filtering
- **"Area"** / **"LOCATION V2"** - Used for area filtering
- **"Mode of Teaching"** - Used for mode filtering
- **"Class Size (Group/ Solo)"** - Used for class size filtering

---

## ❌ UNUSED COLUMNS (CAN BE DELETED)

### Display/UI Related (Not Used)
- **"Featured"** - Not used (using `teachers_list.is_featured` instead)
- **"Featured Subject"** - Not used
- **"Card Color"** - Not used
- **"Features Color"** - Not used
- **"Hero Image:alt"** - Not used (alt text not implemented)

### Contact Information (Not Used)
- **"Phone Number"** - Not used (using "Link" for WhatsApp extraction instead)
- **"Address"** - Not used
- **"Email ID"** - Not used

### Media Files (Not Used)
- **"Screenshot 4"** - Not used
- **"Screenshot 4:alt"** - Not used
- **"Screenshot 5"** - Not used
- **"Screenshot 5:alt"** - Not used
- **"Video"** - Not used
- **"Video Link"** - Not used
- **"video link"** - Not used (duplicate of "Video Link")

### Other (Not Used)
- **"Place of Teaching"** - Not used
- **"Option"** - Not used
- **"Option 2"** - Not used
- **"Content"** - Not used (using "Description" instead)

---

## 📊 Summary

**Total Columns in Schema:** ~40 columns
**Used Columns:** 21 columns
**Unused Columns:** 19 columns

### Recommendation

You can safely delete the 19 unused columns listed above. However, before deleting:

1. **Backup the data** - Export the table first
2. **Check for any external integrations** - Make sure no other systems are using these columns
3. **Test in staging** - Delete columns in a test environment first
4. **Consider keeping for future use** - Some columns like "Video", "Screenshot 4/5" might be used in future features

### SQL to Check Column Usage

```sql
-- Check if any of these columns have non-null data
SELECT 
  COUNT(*) FILTER (WHERE "Featured" IS NOT NULL) as featured_count,
  COUNT(*) FILTER (WHERE "Featured Subject" IS NOT NULL) as featured_subject_count,
  COUNT(*) FILTER (WHERE "Card Color" IS NOT NULL) as card_color_count,
  COUNT(*) FILTER (WHERE "Features Color" IS NOT NULL) as features_color_count,
  COUNT(*) FILTER (WHERE "Hero Image:alt" IS NOT NULL) as hero_image_alt_count,
  COUNT(*) FILTER (WHERE "Phone Number" IS NOT NULL) as phone_number_count,
  COUNT(*) FILTER (WHERE "Address" IS NOT NULL) as address_count,
  COUNT(*) FILTER (WHERE "Email ID" IS NOT NULL) as email_id_count,
  COUNT(*) FILTER (WHERE "Screenshot 4" IS NOT NULL) as screenshot_4_count,
  COUNT(*) FILTER (WHERE "Screenshot 5" IS NOT NULL) as screenshot_5_count,
  COUNT(*) FILTER (WHERE "Video" IS NOT NULL) as video_count,
  COUNT(*) FILTER (WHERE "Video Link" IS NOT NULL) as video_link_count,
  COUNT(*) FILTER (WHERE "Place of Teaching" IS NOT NULL) as place_of_teaching_count,
  COUNT(*) FILTER (WHERE "Option" IS NOT NULL) as option_count,
  COUNT(*) FILTER (WHERE "Option 2" IS NOT NULL) as option_2_count,
  COUNT(*) FILTER (WHERE "Content" IS NOT NULL) as content_count
FROM public."Shikshaqmine";
```

### SQL to Delete Unused Columns

```sql
-- WARNING: This will permanently delete these columns and their data
-- Make sure to backup first!

ALTER TABLE public."Shikshaqmine"
  DROP COLUMN IF EXISTS "Featured",
  DROP COLUMN IF EXISTS "Featured Subject",
  DROP COLUMN IF EXISTS "Card Color",
  DROP COLUMN IF EXISTS "Features Color",
  DROP COLUMN IF EXISTS "Hero Image:alt",
  DROP COLUMN IF EXISTS "Phone Number",
  DROP COLUMN IF EXISTS "Address",
  DROP COLUMN IF EXISTS "Email ID",
  DROP COLUMN IF EXISTS "Screenshot 4",
  DROP COLUMN IF EXISTS "Screenshot 4:alt",
  DROP COLUMN IF EXISTS "Screenshot 5",
  DROP COLUMN IF EXISTS "Screenshot 5:alt",
  DROP COLUMN IF EXISTS "Video",
  DROP COLUMN IF EXISTS "Video Link",
  DROP COLUMN IF EXISTS "video link",
  DROP COLUMN IF EXISTS "Place of Teaching",
  DROP COLUMN IF EXISTS "Option",
  DROP COLUMN IF EXISTS "Option 2",
  DROP COLUMN IF EXISTS "Content";
```

