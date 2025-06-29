# 🚀 NEON SEO BEACON - PRODUCTION DEPLOYMENT CHECKLIST

## ✅ DAY 1: TECHNICAL POLISH & FIXES

### Critical Fixes (Priority 1)

1. **Remove Duplicate Rate Limiting Files**

   ```bash
   # Remove the old rate limiting file to eliminate warnings
   rm server/utils/rateLimit.ts
   # Keep: server/utils/secureRateLimit.ts (more secure)
   ```

2. **Database Tables Verification**

   ```sql
   -- Verify these tables exist in Supabase:
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('audits', 'audit_progress');
   ```

3. **Health Endpoint Optimization**

   ```typescript
   // Add timeout handling to prevent hanging requests
   // File: server/api/health.get.ts
   ```

4. **Environment Variables Validation**
   ```bash
   # Verify all required env vars are set
   node -e "console.log('Supabase:', !!process.env.SUPABASE_URL)"
   node -e "console.log('Anthropic:', !!process.env.ANTHROPIC_API_KEY)"
   ```

### Content Preparation (Priority 2)

5. **Create Missing Content Files**

   ```bash
   mkdir -p content/seo-tips/{technical,on-page,off-page}
   mkdir -p content/docs/{api,guides}
   mkdir -p content/help/{getting-started,troubleshooting}
   ```

6. **Add Legal Pages**
   ```bash
   touch pages/terms.vue
   touch pages/privacy.vue
   touch pages/cookies.vue
   ```

### Performance Optimization (Priority 3)

7. **Bundle Analysis**

   ```bash
   npm run build
   npx nuxi analyze
   ```

8. **Image Optimization**
   ```bash
   # Add optimized images for production
   # Compress favicon and social media images
   ```

## ✅ DAY 2: RAILWAY DEPLOYMENT SETUP

### Railway Configuration

1. **Create Railway Project**
   - Connect GitHub repository
   - Configure custom domain: audit.mardenseo.com
   - Set up environment variables

2. **Environment Variables for Production**

   ```env
   NODE_ENV=production
   SUPABASE_URL=https://cehtwnfdqjehmztnnbch.supabase.co
   SUPABASE_ANON_KEY=[your_key]
   SUPABASE_SERVICE_ROLE_KEY=[your_key]
   ANTHROPIC_API_KEY=[your_key]
   NUXT_PUBLIC_SITE_URL=https://audit.mardenseo.com
   ```

3. **Build Configuration**
   ```json
   {
     "build": {
       "builder": "NIXPACKS",
       "buildCommand": "npm run build",
       "startCommand": "node .output/server/index.mjs"
     }
   }
   ```

### Database Migration

4. **Production Database Setup**

   ```sql
   -- Run in Supabase SQL Editor for production
   CREATE TABLE IF NOT EXISTS audits (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id),
     url TEXT NOT NULL,
     status TEXT DEFAULT 'processing',
     score INTEGER CHECK (score >= 0 AND score <= 100),
     results JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     completed_at TIMESTAMP WITH TIME ZONE
   );

   CREATE TABLE IF NOT EXISTS audit_progress (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
     step INTEGER NOT NULL,
     total_steps INTEGER NOT NULL,
     message TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS
   ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
   ALTER TABLE audit_progress ENABLE ROW LEVEL SECURITY;
   ```

## ✅ DAY 3: DOMAIN & SSL SETUP

### Domain Configuration

1. **DNS Setup for audit.mardenseo.com**

   ```
   CNAME: audit -> your-railway-app.railway.app
   ```

2. **SSL Certificate**
   - Railway handles SSL automatically
   - Verify HTTPS redirect works

3. **SEO Configuration**
   ```xml
   <!-- sitemap.xml optimization -->
   <!-- robots.txt production settings -->
   ```

### Security Hardening

4. **Production Security Headers**

   ```typescript
   // Already configured in nuxt.config.ts
   // Verify CSP, HSTS, security headers
   ```

5. **Rate Limiting Configuration**
   ```env
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

## ✅ DAY 4: TESTING & VALIDATION

### Comprehensive Testing

1. **Production Build Testing**

   ```bash
   NODE_ENV=production npm run build
   NODE_ENV=production npm run preview
   ```

2. **API Endpoint Testing**

   ```bash
   # Test all critical endpoints
   curl https://audit.mardenseo.com/api/health
   curl -X POST https://audit.mardenseo.com/api/seo/analyze
   ```

3. **Cross-Browser Testing**
   ```bash
   npm run test:e2e
   npm run test:accessibility
   ```

### Performance Validation

4. **Lighthouse Audit**

   ```bash
   npm run test:performance
   # Target: Performance >90, Accessibility >95
   ```

5. **Load Testing**
   ```bash
   # Test with multiple concurrent users
   ```

## ✅ DAY 5: LAUNCH & MONITORING

### Deployment

1. **Production Deployment**

   ```bash
   git push main  # Triggers Railway deployment
   ```

2. **Post-Deployment Verification**
   ```bash
   # Verify all functionality works
   # Test user registration
   # Test audit creation
   # Test results display
   ```

### Monitoring Setup

3. **Error Tracking**

   ```bash
   # Setup Sentry (optional)
   npm install @sentry/vue
   ```

4. **Analytics**

   ```bash
   # Setup Google Analytics
   # Setup user behavior tracking
   ```

5. **Uptime Monitoring**
   ```bash
   # Setup UptimeRobot or similar
   # Monitor https://audit.mardenseo.com/api/health
   ```

## 🎯 SUCCESS CRITERIA

### Technical Metrics

- [ ] All 91 tests passing
- [ ] Build completes without errors
- [ ] Health endpoint responds < 2s
- [ ] Lighthouse score > 90

### Functional Metrics

- [ ] User registration works
- [ ] SEO audits complete successfully
- [ ] Real-time progress tracking works
- [ ] Results display properly

### Performance Metrics

- [ ] Page load time < 3s
- [ ] API responses < 500ms
- [ ] 99.9% uptime target

## 🚨 ROLLBACK PLAN

If issues occur:

1. Check Railway deployment logs
2. Verify environment variables
3. Test database connectivity
4. Rollback to previous deployment
5. Check DNS propagation

## 📞 SUPPORT CONTACTS

- Railway Support: help@railway.app
- Supabase Support: support@supabase.io
- Domain Issues: Check mardenseo.com DNS settings
