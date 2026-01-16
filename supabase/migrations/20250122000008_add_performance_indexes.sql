-- Add performance indexes for Browse page optimization
-- These indexes will significantly speed up queries

-- Index on teachers_list for ordering and filtering
CREATE INDEX IF NOT EXISTS idx_teachers_list_featured_name 
  ON public.teachers_list(is_featured DESC NULLS LAST, name);

-- Index on teachers_list slug for joins
CREATE INDEX IF NOT EXISTS idx_teachers_list_slug 
  ON public.teachers_list(slug);

-- Index on Shikshaqmine Slug column (most important for filtering)
CREATE INDEX IF NOT EXISTS idx_shikshaqmine_slug 
  ON public."Shikshaqmine"("Slug");

-- Index on Shikshaqmine Subjects for faster subject filtering
-- Using GIN index for text search if Subjects contains comma-separated values
-- If it's a single text column, use regular index
CREATE INDEX IF NOT EXISTS idx_shikshaqmine_subjects 
  ON public."Shikshaqmine" USING gin(to_tsvector('english', "Subjects"));

-- Index on Shikshaqmine Classes Taught for Backend for faster class filtering
CREATE INDEX IF NOT EXISTS idx_shikshaqmine_classes_backend 
  ON public."Shikshaqmine"("Classes Taught for Backend");

-- Index on Shikshaqmine Area for faster area filtering
CREATE INDEX IF NOT EXISTS idx_shikshaqmine_area 
  ON public."Shikshaqmine"("Area");

-- Index on Shikshaqmine Mode of Teaching for faster mode filtering
CREATE INDEX IF NOT EXISTS idx_shikshaqmine_mode 
  ON public."Shikshaqmine"("Mode of Teaching");

-- Composite index for common filter combinations (Subject + Class + Area)
CREATE INDEX IF NOT EXISTS idx_shikshaqmine_filter_combo 
  ON public."Shikshaqmine"("Slug", "Subjects", "Classes Taught for Backend", "Area");

-- Index on teacher_upvotes for faster featured teacher queries
CREATE INDEX IF NOT EXISTS idx_teacher_upvotes_teacher_id 
  ON public.teacher_upvotes(teacher_id);

-- Index on teacher_upvotes for counting (used in Index page)
CREATE INDEX IF NOT EXISTS idx_teacher_upvotes_count 
  ON public.teacher_upvotes(teacher_id, created_at DESC);

-- Analyze tables to update statistics
ANALYZE public.teachers_list;
ANALYZE public."Shikshaqmine";
ANALYZE public.teacher_upvotes;

