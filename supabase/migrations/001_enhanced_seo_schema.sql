-- Enhanced SEO Beacon Schema for Multi-page Crawling and Analysis
-- Run this migration in your Supabase SQL editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sites table: Track websites being monitored
CREATE TABLE IF NOT EXISTS sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audits table: Individual audit runs
CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    score INTEGER,
    config JSONB DEFAULT '{}',
    results JSONB,
    processing_time_ms INTEGER,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Audit pages: Individual pages crawled during an audit
CREATE TABLE IF NOT EXISTS audit_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    depth INTEGER DEFAULT 0,
    status_code INTEGER,
    content_type TEXT,
    response_time INTEGER,
    score INTEGER,
    issues_count INTEGER DEFAULT 0,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(audit_id, url)
);

-- Audit issues: SEO issues found during audit
CREATE TABLE IF NOT EXISTS audit_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    page_id UUID REFERENCES audit_pages(id) ON DELETE CASCADE,
    issue_id TEXT NOT NULL,
    severity TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    recommendation TEXT,
    impact TEXT,
    affected_element TEXT,
    current_value TEXT,
    expected_value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit progress: Real-time progress tracking
CREATE TABLE IF NOT EXISTS audit_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    step INTEGER NOT NULL,
    total_steps INTEGER NOT NULL,
    message TEXT,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance metrics: Core Web Vitals and performance data
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
    page_id UUID REFERENCES audit_pages(id) ON DELETE CASCADE,
    strategy TEXT NOT NULL, -- 'mobile' or 'desktop'
    performance_score INTEGER,
    lcp_value NUMERIC,
    lcp_score INTEGER,
    fcp_value NUMERIC,
    fcp_score INTEGER,
    cls_value NUMERIC,
    cls_score INTEGER,
    tbt_value NUMERIC,
    tbt_score INTEGER,
    ttfb_value NUMERIC,
    si_value NUMERIC,
    opportunities JSONB,
    diagnostics JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled audits: For recurring audit schedules
CREATE TABLE IF NOT EXISTS scheduled_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    schedule TEXT NOT NULL, -- Cron expression
    config JSONB DEFAULT '{}',
    enabled BOOLEAN DEFAULT true,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audits_site_id ON audits(site_id);
CREATE INDEX IF NOT EXISTS idx_audits_user_id ON audits(user_id);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits(status);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_pages_audit_id ON audit_pages(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_pages_url ON audit_pages(url);

CREATE INDEX IF NOT EXISTS idx_audit_issues_audit_id ON audit_issues(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_issues_page_id ON audit_issues(page_id);
CREATE INDEX IF NOT EXISTS idx_audit_issues_severity ON audit_issues(severity);
CREATE INDEX IF NOT EXISTS idx_audit_issues_category ON audit_issues(category);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_audit_id ON performance_metrics(audit_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_page_id ON performance_metrics(page_id);

CREATE INDEX IF NOT EXISTS idx_sites_user_id ON sites(user_id);
CREATE INDEX IF NOT EXISTS idx_sites_url ON sites(url);

-- Row Level Security (RLS) policies
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_audits ENABLE ROW LEVEL SECURITY;

-- Sites policies
CREATE POLICY "Users can view their own sites" ON sites
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create sites" ON sites
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own sites" ON sites
    FOR UPDATE USING (auth.uid() = user_id);

-- Audits policies
CREATE POLICY "Users can view their own audits" ON audits
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create audits" ON audits
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Audit pages policies (inherit from audit)
CREATE POLICY "Users can view audit pages" ON audit_pages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM audits
            WHERE audits.id = audit_pages.audit_id
            AND (audits.user_id = auth.uid() OR audits.user_id IS NULL)
        )
    );

-- Audit issues policies (inherit from audit)
CREATE POLICY "Users can view audit issues" ON audit_issues
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM audits
            WHERE audits.id = audit_issues.audit_id
            AND (audits.user_id = auth.uid() OR audits.user_id IS NULL)
        )
    );

-- Audit progress policies (inherit from audit)
CREATE POLICY "Users can view audit progress" ON audit_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM audits
            WHERE audits.id = audit_progress.audit_id
            AND (audits.user_id = auth.uid() OR audits.user_id IS NULL)
        )
    );

-- Performance metrics policies (inherit from audit)
CREATE POLICY "Users can view performance metrics" ON performance_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM audits
            WHERE audits.id = performance_metrics.audit_id
            AND (audits.user_id = auth.uid() OR audits.user_id IS NULL)
        )
    );

-- Scheduled audits policies
CREATE POLICY "Users can manage their scheduled audits" ON scheduled_audits
    FOR ALL USING (auth.uid() = user_id);

-- Service role bypass for background jobs
CREATE POLICY "Service role can manage all sites" ON sites
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage all audits" ON audits
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage all audit pages" ON audit_pages
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage all audit issues" ON audit_issues
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage all audit progress" ON audit_progress
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role can manage all performance metrics" ON performance_metrics
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sites_updated_at
    BEFORE UPDATE ON sites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audits_updated_at
    BEFORE UPDATE ON audits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_audits_updated_at
    BEFORE UPDATE ON scheduled_audits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- View for audit summary
CREATE OR REPLACE VIEW audit_summary AS
SELECT
    a.id,
    a.site_id,
    a.url,
    a.status,
    a.score,
    a.created_at,
    a.completed_at,
    COUNT(DISTINCT ap.id) AS page_count,
    COUNT(DISTINCT ai.id) AS issue_count,
    COUNT(DISTINCT CASE WHEN ai.severity = 'critical' THEN ai.id END) AS critical_issues,
    COUNT(DISTINCT CASE WHEN ai.severity = 'high' THEN ai.id END) AS high_issues
FROM audits a
LEFT JOIN audit_pages ap ON a.id = ap.audit_id
LEFT JOIN audit_issues ai ON a.id = ai.audit_id
GROUP BY a.id;

COMMENT ON TABLE sites IS 'Websites being monitored for SEO';
COMMENT ON TABLE audits IS 'Individual SEO audit runs';
COMMENT ON TABLE audit_pages IS 'Pages crawled during an audit';
COMMENT ON TABLE audit_issues IS 'SEO issues found during audits';
COMMENT ON TABLE performance_metrics IS 'Core Web Vitals and performance data';
COMMENT ON TABLE scheduled_audits IS 'Recurring audit schedules';
