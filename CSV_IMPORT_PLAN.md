# CSV Import Plan for Shikshaqmine Table

## Overview
- **Current rows:** 92
- **New CSV rows:** 135
- **Total expected:** Up to 227 (if no duplicates)
- **Unique identifier:** `Slug` column

## Strategy: Safe Import with Duplicate Handling

### Step 1: Backup Current Data ✅
**Before doing anything, create a backup:**

```sql
-- Create backup table
CREATE TABLE IF NOT EXISTS public."Shikshaqmine_backup_YYYYMMDD" AS 
SELECT * FROM public."Shikshaqmine";

-- Verify backup
SELECT COUNT(*) FROM public."Shikshaqmine_backup_YYYYMMDD";
-- Should return 92
```

### Step 2: Analyze CSV for Duplicates 🔍
**Before importing, check for duplicates:**

1. **Extract all Slugs from CSV** (first column should be Slug)
2. **Query existing Slugs in database:**
```sql
SELECT "Slug" FROM public."Shikshaqmine";
```
3. **Compare CSV Slugs vs Database Slugs**
   - If Slug exists in both → **UPDATE** (replace existing row)
   - If Slug only in CSV → **INSERT** (new row)
   - If Slug only in database → **KEEP** (unchanged)

### Step 3: Import Options 🎯

#### Option A: Supabase Dashboard Import (Recommended for first time)
1. Go to Supabase Dashboard → Table Editor → `Shikshaqmine`
2. Click "Import data" → Upload CSV
3. **Important:** Select "Update existing rows" option
4. Map CSV columns to database columns
5. Use `Slug` as the conflict resolution key

**Pros:** Visual, safe, easy to undo
**Cons:** May need to handle column name mapping manually

#### Option B: SQL Script with ON CONFLICT (Most Control)
Create a migration file that:
1. Reads CSV data
2. Uses `INSERT ... ON CONFLICT (Slug) DO UPDATE`
3. Updates only changed columns

**Pros:** Full control, can preview changes
**Cons:** Requires SQL knowledge

#### Option C: Python/Node Script (Best for Large Datasets)
Write a script that:
1. Reads CSV
2. Checks each row against database
3. Inserts new or updates existing
4. Provides detailed report

**Pros:** Most flexible, can add validation
**Cons:** Requires coding

### Step 4: Recommended Approach (Hybrid) 🚀

**Phase 1: Preparation**
```sql
-- 1. Create backup
CREATE TABLE IF NOT EXISTS public."Shikshaqmine_backup_20250122" AS 
SELECT * FROM public."Shikshaqmine";

-- 2. Check current count
SELECT COUNT(*) as current_count FROM public."Shikshaqmine";

-- 3. Get list of existing Slugs
SELECT "Slug" FROM public."Shikshaqmine" ORDER BY "Slug";
```

**Phase 2: Import via Supabase Dashboard**
1. Export your CSV to ensure it's clean
2. Go to Supabase Dashboard → Table Editor → `Shikshaqmine`
3. Click "Import data from CSV"
4. **Settings:**
   - Conflict resolution: "Update existing rows"
   - Match on: `Slug` column
   - Skip empty values: Yes (to preserve existing data)
5. Review the preview before confirming

**Phase 3: Verification**
```sql
-- Check new count
SELECT COUNT(*) as new_count FROM public."Shikshaqmine";
-- Should be between 92-227 depending on duplicates

-- Check for any issues
SELECT "Slug", COUNT(*) 
FROM public."Shikshaqmine" 
GROUP BY "Slug" 
HAVING COUNT(*) > 1;
-- Should return 0 rows (no duplicate Slugs)

-- Sample check: Compare a few rows
SELECT "Slug", "Title", "Subjects" 
FROM public."Shikshaqmine" 
ORDER BY "Slug" 
LIMIT 10;
```

**Phase 4: Rollback Plan (if needed)**
```sql
-- If something goes wrong, restore from backup
DELETE FROM public."Shikshaqmine";
INSERT INTO public."Shikshaqmine" 
SELECT * FROM public."Shikshaqmine_backup_20250122";
```

## Column Mapping Reference

Based on your codebase, these are the key columns in Shikshaqmine:
- `Slug` (unique identifier)
- `Title`
- `Featured`
- `EXPANDED`
- `Sir/Ma'am?`
- `Featured Subject`
- `Classes Taught for Backend`
- `Place of Teaching`
- `School Boards Catered`
- `Area`
- `Mode of Teaching`
- `Subjects`
- `Phone Number`
- `Classes Taught`
- `Card Color`
- `Features Color`
- `Hero Image`
- `Hero Image:alt`
- `Address`
- `Email ID`
- `Class Size (Group/ Solo)`
- `Description`
- `Screenshot 4`
- `Screenshot 4:alt`
- `Screenshot 5`
- `Screenshot 5:alt`
- `Video`
- `Review 1`
- `Review 2`
- `Review 3`
- `Option`
- `Link`
- `Video Link`
- `video link`
- `Option 2`
- `LOCATION V2`
- `STUDENT'S HOME IN THESE AREAS`
- `TUTOR'S HOME IN THESE AREAS`
- `Content`
- `Qualifications etc`
- `Years they started teaching`
- `AREAS FOR FILTERING`
- `id` (auto-generated, don't include in CSV)

## Important Notes ⚠️

1. **Don't include `id` column in CSV** - it's auto-generated
2. **Slug must be unique** - duplicates will be updated, not inserted twice
3. **Column names must match exactly** - including spaces and special characters
4. **Empty cells** - Supabase will handle NULL values automatically
5. **Test with a small batch first** - import 5-10 rows to verify everything works

## Quick Checklist ✅

- [ ] Backup current data
- [ ] Verify CSV column names match database
- [ ] Remove `id` column from CSV if present
- [ ] Check CSV for duplicate Slugs
- [ ] Import via Supabase Dashboard with "Update existing" option
- [ ] Verify row count
- [ ] Check for duplicate Slugs in database
- [ ] Test a few teacher profiles on the website
- [ ] Keep backup for 1-2 weeks before deleting

## Need Help?

If you encounter issues:
1. Check Supabase logs for import errors
2. Verify CSV encoding is UTF-8
3. Ensure column names match exactly (case-sensitive)
4. Check for special characters in Slug column
5. Verify no extra spaces in column headers

