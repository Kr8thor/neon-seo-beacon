# 🚀 Neon SEO Beacon - Claude Desktop Project Instructions

## Project Overview
**Neon SEO Beacon** is a production-grade SEO audit application built with Nuxt 3, TypeScript, and Supabase. This document provides comprehensive instructions for Claude Desktop to help set up, run, and deploy the application.

## ✅ Database Status (COMPLETED)

The PostgreSQL database has been **fully configured** in Supabase with:

### Tables Created:
1. **audits** - Main audit records with user isolation
2. **audit_pages** - Individual pages crawled during audits
3. **audit_issues** - SEO issues discovered (technical, content, performance, etc.)
4. **audit_categories** - Category-wise scoring and metrics
5. **audit_history** - Historical data for trend analysis
6. **api_keys** - API key management for programmatic access

### Security & Features:
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ User isolation policies (users see only their own data)
- ✅ Automatic timestamp triggers (updated_at)
- ✅ Data validation constraints
- ✅ Optimized indexes for performance
- ✅ System user for public/anonymous access
- ✅ Views and functions for analytics

## 🔑 Project Credentials

```yaml
# Supabase Project (CORRECT PROJECT)
Project URL: https://qyspmedutegwcdwlbbot.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5c3BtZWR1dGVnd2Nkd2xiYm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzQ1NTgsImV4cCI6MjA3OTMxMDU1OH0.DHayxPYKp6EiWsBvUxWAtsk3lr8REt2ADpIL-L1ggb8
Dashboard: https://supabase.com/dashboard/project/qyspmedutegwcdwlbbot

# System User (for public/anonymous audits)
System User ID: 00000000-0000-0000-0000-000000000001
System User Email: system@neonseobeacon.local
```

## 📋 Environment Variables Setup

### Step 1: Create .env file in project root

```bash
# Supabase Configuration (CORRECT VALUES)
SUPABASE_URL=https://qyspmedutegwcdwlbbot.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5c3BtZWR1dGVnd2Nkd2xiYm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzQ1NTgsImV4cCI6MjA3OTMxMDU1OH0.DHayxPYKp6EiWsBvUxWAtsk3lr8REt2ADpIL-L1ggb8

# Get this from Supabase Dashboard > Settings > API
SUPABASE_SERVICE_ROLE_KEY=<GET_FROM_DASHBOARD>

# JWT Secret - Generate using one of these commands:
# openssl rand -base64 32
# node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
JWT_SECRET=<GENERATE_A_SECURE_SECRET>

# Public User ID for anonymous audits
PUBLIC_USER_ID=00000000-0000-0000-0000-000000000001

# Optional: Anthropic API Key for AI features
ANTHROPIC_API_KEY=<YOUR_KEY_IF_NEEDED>

# Environment
NODE_ENV=development
APP_URL=http://localhost:3000
```

### Step 2: Get Service Role Key
1. Go to: https://supabase.com/dashboard/project/qyspmedutegwcdwlbbot/settings/api
2. Copy the `service_role` key (keep this secret!)
3. Add to `.env` file

### Step 3: Generate JWT Secret
```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🛠 Local Development Setup

### Prerequisites Check
```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Check if git is installed
git --version
```

### Installation Steps
```bash
# 1. Clone repository (if not already done)
git clone https://github.com/Kr8thor/neon-seo-beacon.git
cd neon-seo-beacon

# 2. Install dependencies
npm install

# 3. Verify TypeScript setup
npm run type-check

# 4. Start development server
npm run dev
```

### Development URLs
- Application: http://localhost:3000
- API Endpoints:
  - Public Audit: http://localhost:3000/api/audit/public
  - Authenticated: http://localhost:3000/api/audit
  - Health Check: http://localhost:3000/api/health

## 🧪 Testing the Application

### 1. Test Public Audit (No Auth Required)
```bash
curl -X POST http://localhost:3000/api/audit/public \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### 2. Test Database Connection
```sql
-- Run in Supabase SQL Editor
SELECT COUNT(*) FROM audits;
SELECT COUNT(*) FROM auth.users WHERE email = 'system@neonseobeacon.local';
```

### 3. Test User Registration Flow
1. Navigate to http://localhost:3000/auth/register
2. Create a new account
3. Verify email (check Supabase Auth dashboard)
4. Login and run authenticated audit

## 📦 Build & Production

### Build Commands
```bash
# Type checking (must pass with 0 errors)
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Build Checklist
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No lint warnings (`npm run lint`)
- [ ] Build completes successfully
- [ ] Preview works at http://localhost:3000

## 🚀 Deployment Options

### Option A: Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Set environment variables
railway variables set SUPABASE_URL="https://qyspmedutegwcdwlbbot.supabase.co"
railway variables set SUPABASE_KEY="<anon_key>"
railway variables set SUPABASE_SERVICE_ROLE_KEY="<service_role_key>"
railway variables set JWT_SECRET="<your_jwt_secret>"
railway variables set PUBLIC_USER_ID="00000000-0000-0000-0000-000000000001"
railway variables set NODE_ENV="production"

# Deploy
railway up

# Get deployment URL
railway open
```

### Option B: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in Vercel Dashboard
# Project Settings > Environment Variables
```

### Option C: Netlify
1. Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = ".output/public"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

2. Deploy via Git or Netlify CLI

## 🔍 Database Queries for Verification

### Check Database Setup
```sql
-- Verify all tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verify system user
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'system@neonseobeacon.local';

-- Check indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Verify enums
SELECT n.nspname as schema, t.typname as enum_name, 
       array_agg(e.enumlabel ORDER BY e.enumsortorder) as enum_values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
GROUP BY n.nspname, t.typname;
```

### Test Audit Creation
```sql
-- Create test audit
INSERT INTO audits (user_id, url, status, score)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'https://test.example.com',
  'pending',
  NULL
)
RETURNING *;

-- Check audit was created
SELECT * FROM audits 
ORDER BY created_at DESC 
LIMIT 1;
```

## 🐛 Troubleshooting Guide

### Common Issues & Solutions

#### 1. "SUPABASE_URL is not defined"
- Ensure `.env` file exists in project root
- Check file has no typos in variable names
- Restart dev server after creating `.env`

#### 2. "Authentication failed"
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check it's from the correct project (qyspmedutegwcdwlbbot)
- Ensure JWT_SECRET is set

#### 3. "User not found for public audit"
- Verify system user exists with ID: `00000000-0000-0000-0000-000000000001`
- Check `PUBLIC_USER_ID` in `.env` matches

#### 4. TypeScript Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .nuxt
npm install
npm run type-check
```

#### 5. Build Failures
```bash
# Clean build
rm -rf .nuxt .output node_modules
npm install
npm run build
```

## 📊 Monitoring & Maintenance

### Supabase Dashboard Links
- **Database Metrics**: https://supabase.com/dashboard/project/qyspmedutegwcdwlbbot/reports
- **API Logs**: https://supabase.com/dashboard/project/qyspmedutegwcdwlbbot/logs/edge-logs
- **Auth Users**: https://supabase.com/dashboard/project/qyspmedutegwcdwlbbot/auth/users
- **SQL Editor**: https://supabase.com/dashboard/project/qyspmedutegwcdwlbbot/sql

### Health Monitoring Queries
```sql
-- Audit statistics
SELECT 
  status,
  COUNT(*) as count,
  AVG(score) as avg_score
FROM audits
GROUP BY status;

-- Recent audits
SELECT 
  id,
  url,
  status,
  score,
  created_at
FROM audits
ORDER BY created_at DESC
LIMIT 10;

-- User activity
SELECT 
  user_id,
  COUNT(*) as audit_count,
  MAX(created_at) as last_audit
FROM audits
GROUP BY user_id;
```

## 🔐 Security Checklist

- [ ] All environment variables set correctly
- [ ] Service role key kept secret
- [ ] RLS enabled on all tables
- [ ] HTTPS configured in production
- [ ] Rate limiting configured
- [ ] CORS settings updated for production URL
- [ ] API keys properly hashed

## 📚 Project Structure

```
neon-seo-beacon/
├── .env                    # Environment variables
├── nuxt.config.ts         # Nuxt configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── components/            # Vue components
├── pages/                 # Application pages
├── server/               
│   ├── api/              # API endpoints
│   └── utils/            # Server utilities
├── stores/               # Pinia stores
├── assets/              
│   └── css/             # Styles & design tokens
└── types/               # TypeScript types
```

## 🎯 Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run type-check       # Check TypeScript
npm run lint            # Check code quality
npm run lint:fix        # Fix lint issues

# Building
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test:unit       # Run unit tests
npm run test:e2e        # Run E2E tests

# Deployment
railway up              # Deploy to Railway
vercel                  # Deploy to Vercel
```

## ✅ Final Verification Steps

1. **Database Ready**: All tables, policies, and functions created ✅
2. **System User**: Created with ID `00000000-0000-0000-0000-000000000001` ✅
3. **Environment**: `.env` file configured with correct values
4. **Build**: TypeScript checking passes with 0 errors
5. **Local Test**: Application runs at http://localhost:3000
6. **API Test**: Public audit endpoint works
7. **Deployment**: Ready for Railway/Vercel/Netlify

## 🆘 Support Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/qyspmedutegwcdwlbbot
- **GitHub Repository**: https://github.com/Kr8thor/neon-seo-beacon
- **Nuxt Documentation**: https://nuxt.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **TypeScript Docs**: https://www.typescriptlang.org/docs

---

**Current Status**: Database fully configured and ready. Application can be deployed immediately after setting environment variables.

**Next Step**: Add `SUPABASE_SERVICE_ROLE_KEY` to `.env` file from the Supabase dashboard and run `npm run dev`.
