CREATE TABLE IF NOT EXISTS site_data (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_data_updated_at
  BEFORE UPDATE ON site_data FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

ALTER TABLE site_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON site_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON site_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON site_data FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON site_data FOR DELETE USING (true);
