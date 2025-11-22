# 🗄️ Database Schema - SQL Reference Guide

**Supabase Project**: `qyspmedutegwcdwlbbot`  
**Database**: PostgreSQL  
**Region**: US  

---

## 📋 Quick Navigation

- [Enums](#enums)
- [Tables](#tables)
- [Indexes](#indexes)
- [Common Queries](#common-queries)
- [RLS Details](#rls-details)
- [Performance Tips](#performance-tips)

---

## Enums

### audit_status
```sql
CREATE TYPE audit_status AS ENUM ('pending', 'processing', 'completed', 'failed');
```
**Usage**: Status tracking for SEO audits

### issue_category
```sql
CREATE TYPE issue_category AS ENUM ('technical', 'content', 'performance', 'accessibility', 'security');
```
**Usage**: Categorizing issues found during audits

### issue_severity
```sql
CREATE TYPE issue_severity AS ENUM ('critical', 'high', 'medium', 'low', 'info');
```
**Usage**: Prioritizing fixes for users

### audit_category
```sql
CREATE TYPE audit_category AS ENUM ('technical', 'content', 'performance', 'accessibility', 'security', 'mobile');
```
**Usage**: Category-specific scoring

---

## Tables

### audits
**Primary table for audit jobs**

```sql
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  status audit_status DEFAULT 'pending',
  score INTEGER CHECK (score >= 0 AND score <= 100),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'
);
```

**Indexes**:
- `idx_audits_user_id` - User lookups
- `idx_audits_status` - Status filtering
- `idx_audits_created_at DESC` - Recent first

**Triggers**:
- `trigger_audits_updated_at` - Auto-update timestamp

---

### audit_pages
**Individual pages crawled**

```sql
CREATE TABLE audit_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  status_code INTEGER CHECK (status_code >= 100 AND status_code <= 599),
  title TEXT,
  meta_description TEXT,
  load_time_ms INTEGER,
  content_size_bytes INTEGER,
  word_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Indexes**:
- `idx_audit_pages_audit_id` - Audit lookup
- `idx_audit_pages_url` - Duplicate detection

---

### audit_issues
**Issues and findings**

```sql
CREATE TABLE audit_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  page_id UUID REFERENCES audit_pages(id) ON DELETE SET NULL,
  category issue_category NOT NULL,
  severity issue_severity NOT NULL,
  rule_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  recommendation TEXT,
  affected_element TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Indexes**:
- `idx_audit_issues_audit_id` - Audit lookup
- `idx_audit_issues_severity` - Severity filtering
- `idx_audit_issues_category` - Category filtering

**Notes**:
- `page_id` is nullable for site-wide issues
- Each issue is tied to an audit via `audit_id`

---

### audit_categories
**Category scores per audit**

```sql
CREATE TABLE audit_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  category audit_category NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  issues_count INTEGER DEFAULT 0,
  passed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(audit_id, category)
);
```

**Indexes**:
- `idx_audit_categories_audit_id` - Audit lookup
- Unique constraint prevents duplicate categories per audit

---

### audit_history
**Historical score tracking**

```sql
CREATE TABLE audit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  audit_id UUID NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  recorded_at TIMESTAMPTZ DEFAULT now()
);
```

**Indexes**:
- `idx_audit_history_user_id` - User trends
- `idx_audit_history_url` - URL grouping
- `idx_audit_history_recorded_at DESC` - Time ranges

**Use Case**: Building trend graphs showing score changes over time

---

### api_keys
**Programmatic access**

```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Indexes**:
- `idx_api_keys_user_id` - User's keys
- `idx_api_keys_key_hash` - Authentication

**Security**:
- Keys stored as bcrypt hashes (never store raw keys!)
- `key_prefix` shows first 8 chars for user recognition
- `expires_at` for key rotation policies

---

## Indexes

### Performance Optimizations

**User Lookups** (Used by RLS):
```
idx_audits_user_id
idx_audit_history_user_id
idx_api_keys_user_id
```

**Foreign Key Joins**:
```
idx_audit_pages_audit_id
idx_audit_issues_audit_id
idx_audit_categories_audit_id
```

**Filtering & Search**:
```
idx_audits_status
idx_audit_issues_severity
idx_audit_issues_category
idx_audit_pages_url
idx_audit_history_url
```

**Time-Based Queries** (Descending for recent data):
```
idx_audits_created_at DESC
idx_audit_history_recorded_at DESC
```

**Unique Constraints** (Prevent duplicates):
```
api_keys.key_hash UNIQUE
audit_categories (audit_id, category) UNIQUE
```

---

## Common Queries

### Get User's Audits
```sql
SELECT * FROM audits 
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 10;
```

### Get Issues by Severity
```sql
SELECT 
  ai.id,
  ai.title,
  ai.severity,
  ap.url as page_url
FROM audit_issues ai
LEFT JOIN audit_pages ap ON ai.page_id = ap.id
WHERE ai.audit_id = 'audit-uuid'
ORDER BY 
  CASE ai.severity
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
    ELSE 5
  END;
```

### Get Category Breakdown
```sql
SELECT 
  category,
  score,
  issues_count,
  passed_count
FROM audit_categories
WHERE audit_id = 'audit-uuid'
ORDER BY score DESC;
```

### Get Score Trends
```sql
SELECT 
  recorded_at,
  score
FROM get_audit_trend(auth.uid(), 'https://example.com', 30)
ORDER BY recorded_at ASC;
```

### Get All Pages in Audit
```sql
SELECT 
  url,
  status_code,
  load_time_ms,
  word_count,
  created_at
FROM audit_pages
WHERE audit_id = 'audit-uuid'
ORDER BY url;
```

### Count Issues by Category
```sql
SELECT 
  category,
  COUNT(*) as count,
  COUNT(CASE WHEN severity = 'critical' THEN 1 END) as critical
FROM audit_issues
WHERE audit_id = 'audit-uuid'
GROUP BY category
ORDER BY count DESC;
```

### Get Recent Audits with Scores
```sql
SELECT 
  a.id,
  a.url,
  a.score,
  a.status,
  a.created_at,
  COUNT(ai.id) as issue_count
FROM audits a
LEFT JOIN audit_issues ai ON a.id = ai.audit_id
WHERE a.user_id = auth.uid()
GROUP BY a.id
ORDER BY a.created_at DESC
LIMIT 20;
```

---

## RLS Details

### RLS Policies by Table

#### audits
```sql
-- SELECT: Users see their own audits
CREATE POLICY "Users can view own audits"
  ON audits
  FOR SELECT
  USING (user_id = auth.uid());

-- INSERT: Users create audits for themselves
CREATE POLICY "Users can create audits"
  ON audits
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- UPDATE: Users modify their own audits
CREATE POLICY "Users can update own audits"
  ON audits
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DELETE: Users delete their own audits
CREATE POLICY "Users can delete own audits"
  ON audits
  FOR DELETE
  USING (user_id = auth.uid());
```

#### audit_pages
```sql
-- Inherits through audit_id -> audits RLS
-- INSERT/UPDATE/DELETE restricted by audit ownership
```

#### audit_issues
```sql
-- Inherits through audit_id -> audits RLS
-- Can access only if user owns the parent audit
```

#### audit_categories
```sql
-- Inherits through audit_id -> audits RLS
-- Scores visible only to audit owner
```

#### audit_history
```sql
-- Direct user_id check
-- Users see only their own score history
```

#### api_keys
```sql
-- Strict isolation on user_id
-- Users manage only their own keys
```

---

## Performance Tips

### 1. Always Filter by user_id First (RLS)
```sql
-- ✅ GOOD - Uses index, respects RLS
SELECT * FROM audits 
WHERE user_id = auth.uid() AND status = 'completed';

-- ❌ LESS EFFICIENT - Scans more rows
SELECT * FROM audits 
WHERE status = 'completed' AND user_id = auth.uid();
```

### 2. Use Indexes for Joins
```sql
-- ✅ GOOD - Uses indexes on both sides
SELECT a.*, ap.url 
FROM audits a
JOIN audit_pages ap ON a.id = ap.audit_id
WHERE a.user_id = auth.uid();
```

### 3. Limit Result Sets
```sql
-- ✅ GOOD - Pagination friendly
SELECT * FROM audits 
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 50 OFFSET 0;
```

### 4. Use Functions for Complex Queries
```sql
-- ✅ GOOD - Single function call
SELECT * FROM get_audit_trend(auth.uid(), 'https://example.com', 30);

-- ❌ LESS EFFICIENT - Multiple queries
-- ... manual loop building
```

### 5. Filter Early
```sql
-- ✅ GOOD - Filters in WHERE clause
SELECT COUNT(*) FROM audit_issues 
WHERE audit_id IN (SELECT id FROM audits WHERE user_id = auth.uid())
  AND severity = 'critical';

-- Consider: JOIN is often faster
```

---

## Migrations & Updates

### To Add a New Issue Type
```sql
INSERT INTO audit_issues (audit_id, page_id, category, severity, rule_id, title, description, recommendation)
VALUES (
  'audit-uuid',
  'page-uuid',
  'technical'::issue_category,
  'high'::issue_severity,
  'new-rule-id',
  'Issue Title',
  'Description of the issue',
  'How to fix it'
);
```

### To Update Audit Score
```sql
UPDATE audits
SET score = 85, status = 'completed'::audit_status, completed_at = now()
WHERE id = 'audit-uuid' AND user_id = auth.uid();
-- updated_at automatically updated by trigger
```

### To Track Score History
```sql
INSERT INTO audit_history (user_id, url, audit_id, score)
VALUES (auth.uid(), 'https://example.com', 'audit-uuid', 85);
```

---

## Useful Views

### audit_summary
**Join audits with category scores**

```sql
SELECT * FROM audit_summary
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
```

---

## Functions

### get_audit_trend()
**Get historical scores for an audit URL**

```sql
SELECT * FROM get_audit_trend(
  auth.uid()::uuid,
  'https://example.com'::text,
  30::int
);
```

Returns: `(recorded_at, score)` tuples

---

## Data Types Reference

| Type | Usage | Example |
|------|-------|---------|
| UUID | Primary/Foreign keys | `'550e8400-e29b-41d4-a716-446655440000'` |
| TEXT | URLs, titles, descriptions | `'https://example.com'` |
| INTEGER | Scores, counts, HTTP codes | `85`, `0-100` |
| BOOLEAN | Active/inactive flags | `true`, `false` |
| TIMESTAMPTZ | All timestamps | `now()` |
| JSONB | Flexible metadata | `'{"key": "value"}'` |
| ENUM | Fixed value sets | `'critical'::issue_severity` |

---

## Connection String

```
PostgreSQL: postgresql://user:password@db.qyspmedutegwcdwlbbot.supabase.co:5432/postgres
```

---

## Documentation

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Project README](README.md)

---

**Last Updated**: November 21, 2025