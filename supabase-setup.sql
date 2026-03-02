-- =====================================================
-- Supabase Setup: site_data table + images bucket
-- RLS: Public read, Authenticated write
-- =====================================================

-- 1) site_data table
CREATE TABLE IF NOT EXISTS public.site_data (
  key   TEXT PRIMARY KEY,
  value JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_data ENABLE ROW LEVEL SECURITY;

-- Drop old permissive policies if they exist
DROP POLICY IF EXISTS "Public read"          ON public.site_data;
DROP POLICY IF EXISTS "Public write"         ON public.site_data;
DROP POLICY IF EXISTS "Public update"        ON public.site_data;
DROP POLICY IF EXISTS "Public delete"        ON public.site_data;
DROP POLICY IF EXISTS "Auth write"           ON public.site_data;
DROP POLICY IF EXISTS "Auth update"          ON public.site_data;
DROP POLICY IF EXISTS "Auth delete"          ON public.site_data;

-- Anyone can read
CREATE POLICY "Public read" ON public.site_data
  FOR SELECT USING (true);

-- Only authenticated users can write
CREATE POLICY "Auth write" ON public.site_data
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Auth update" ON public.site_data
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth delete" ON public.site_data
  FOR DELETE USING (auth.role() = 'authenticated');


-- 2) images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop old permissive policies if they exist
DROP POLICY IF EXISTS "Public image read"    ON storage.objects;
DROP POLICY IF EXISTS "Public image upload"  ON storage.objects;
DROP POLICY IF EXISTS "Public image update"  ON storage.objects;
DROP POLICY IF EXISTS "Public image delete"  ON storage.objects;
DROP POLICY IF EXISTS "Auth image upload"    ON storage.objects;
DROP POLICY IF EXISTS "Auth image update"    ON storage.objects;
DROP POLICY IF EXISTS "Auth image delete"    ON storage.objects;

-- Anyone can read images
CREATE POLICY "Public image read" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

-- Only authenticated users can upload/update/delete
CREATE POLICY "Auth image upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth image update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth image delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
