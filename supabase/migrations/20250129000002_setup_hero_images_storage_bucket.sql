-- Migration: Set up hero-images storage bucket policies for admin image uploads
-- Note: The bucket must be created via Supabase Dashboard first
-- This migration creates the storage policies

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Admins can upload hero images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update hero images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete hero images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view hero images" ON storage.objects;

-- Policy: Admins can upload images to hero-images bucket
CREATE POLICY "Admins can upload hero images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hero-images' AND
  public.is_admin()
);

-- Policy: Admins can update images in hero-images bucket
CREATE POLICY "Admins can update hero images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'hero-images' AND
  public.is_admin()
);

-- Policy: Admins can delete images from hero-images bucket
CREATE POLICY "Admins can delete hero images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'hero-images' AND
  public.is_admin()
);

-- Policy: Public can view images from hero-images bucket (for displaying on website)
CREATE POLICY "Public can view hero images"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-images');

