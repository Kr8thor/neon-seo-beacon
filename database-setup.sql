-- ========================================
-- NEON SEO BEACON - PRODUCTION DATABASE SETUP
-- ========================================
-- Run this in your Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/cehtwnfdqjehmztnnbch

-- ========================================
-- 1. CREATE AUDITS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  domain TEXT, -- Extracted domain for easier querying
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed', 'cancelled')),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  results JSONB,
  error TEXT,
  processing_time_ms INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. CREATE AUDIT PROGRESS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS audit_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  step INTEGER NOT NULL,
  total_steps INTEGER NOT NULL,
  message TEXT,
  percentage INTEGER DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_audits_user_created ON audits (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits (status);
CREATE INDEX IF NOT EXISTS idx_audits_domain ON audits (domain);
CREATE INDEX IF NOT EXISTS idx_audits_score ON audits (score) WHERE score IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audit_progress_audit_id ON audit_progress (audit_id);

-- ========================================
-- 4. ADD UPDATED_AT TRIGGER
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_audits_updated_at 
    BEFORE UPDATE ON audits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ========================================
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_progress ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 6. CREATE SECURITY POLICIES
-- ========================================

-- Audits table policies
CREATE POLICY IF NOT EXISTS "Users can view their own audits" ON audits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create audits" ON audits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own audits" ON audits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own audits" ON audits
  FOR DELETE USING (auth.uid() = user_id);

-- Audit progress table policies
CREATE POLICY IF NOT EXISTS "Users can view progress for their audits" ON audit_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM audits 
      WHERE audits.id = audit_progress.audit_id 
      AND audits.user_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "System can insert audit progress" ON audit_progress
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM audits 
      WHERE audits.id = audit_progress.audit_id
    )
  );

-- ========================================
-- 7. INSERT TEST DATA (OPTIONAL)
-- ========================================
-- Uncomment to add test data for development
/*
INSERT INTO audits (user_id, url, domain, status, score, results) VALUES
(
  auth.uid(),
  'https://example.com',
  'example.com',
  'completed',
  85,
  '{
    "title": {"score": 90, "content": "Example Domain"},
    "description": {"score": 80, "content": "This domain is for use in examples"},
    "performance": {"score": 85, "loadTime": 1200}
  }'::jsonb
);
*/

-- ========================================
-- 8. VERIFY SETUP
-- ========================================
-- Check if tables were created successfully
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('audits', 'audit_progress')
ORDER BY table_name;

-- Check if policies are active
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('audits', 'audit_progress')
ORDER BY tablename, policyname;

-- ========================================
-- SETUP COMPLETE!
-- ========================================
-- Your database is now ready for production use.
-- 
-- Next steps:
-- 1. Test the health endpoint: /api/health
-- 2. Verify audit creation works
-- 3. Check real-time progress tracking
-- ========================================
