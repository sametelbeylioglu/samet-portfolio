-- =============================================
-- Portfolio Site - Supabase Setup
-- Bu SQL'i Supabase Dashboard > SQL Editor'de calistirin
-- =============================================

-- 1. site_data tablosu (tum icerik burada tutulur)
CREATE TABLE IF NOT EXISTS site_data (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. RLS (Row Level Security) aktif et
ALTER TABLE site_data ENABLE ROW LEVEL SECURITY;

-- 3. Herkes okuyabilsin (site publiktir)
CREATE POLICY "Public read" ON site_data
  FOR SELECT USING (true);

-- 4. Herkes yazabilsin (admin paneli browser'dan yazar)
CREATE POLICY "Public write" ON site_data
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update" ON site_data
  FOR UPDATE USING (true);

CREATE POLICY "Public delete" ON site_data
  FOR DELETE USING (true);

-- 5. Gorseller icin Storage bucket olustur
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage politikalari - gorsel yukleme ve okuma
CREATE POLICY "Public image read" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Public image upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

CREATE POLICY "Public image update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images');

CREATE POLICY "Public image delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'images');
