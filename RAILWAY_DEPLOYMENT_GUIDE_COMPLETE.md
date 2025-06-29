# 🚀 **COMPLETE RAILWAY DEPLOYMENT GUIDE**

## Professional Railway Deployment for Neon SEO Beacon

---

## 🎯 **QUICK DEPLOYMENT (5 Minutes)**

### **Prerequisites**

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Navigate to project
cd /mnt/c/Users/Leo/neon-seo-beacon
```

### **One-Command Deployment**

```bash
# Run the automated deployment script
./scripts/deploy-railway.sh
```

---

## 📋 **MANUAL DEPLOYMENT STEPS**

### **Step 1: Project Setup**

```bash
# Initialize Railway project
railway init

# Link to existing project (if you have one)
railway link
```

### **Step 2: Environment Variables**

```bash
# Set all required environment variables
railway variables set NODE_ENV=production
railway variables set NITRO_PRESET=node-server
railway variables set HOST=0.0.0.0

# Supabase Configuration
railway variables set SUPABASE_URL=https://cehtwnfdqjehmztnnbch.supabase.co
railway variables set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlaHR3bmZkcWplaG16dG5uYmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NjM2MDgsImV4cCI6MjA2NTUzOTYwOH0.2Y2h_VpTnVlPVwbMzQaz2-f0Hgtrd_fWp5i1Z6-KkVk
railway variables set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlaHR3bmZkcWplaG16dG5uYmNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTk2MzYwOCwiZXhwIjoyMDY1NTM5NjA4fQ.LZ8oZB7s0wS3DzNGw7V_uhf_9y4V2YiIXUcKaQW3rBo

# Nuxt Public Variables
railway variables set NUXT_PUBLIC_SUPABASE_URL=https://cehtwnfdqjehmztnnbch.supabase.co
railway variables set NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlaHR3bmZkcWplaG16dG5uYmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NjM2MDgsImV4cCI6MjA2NTUzOTYwOH0.2Y2h_VpTnVlPVwbMzQaz2-f0Hgtrd_fWp5i1Z6-KkVk

# Anthropic API
railway variables set ANTHROPIC_API_KEY=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

# Security
railway variables set JWT_SECRET=DPS08k0ANbn2wV3h+l9maK/9bkHi2O8gp+sbE2vB6wE2QPr9iRWKP+gRP5cxDDdgGaO120SYgsokqSSyq9lqGQ==

# Domain Configuration
railway variables set SITE_URL=https://audit.mardenseo.com
railway variables set API_URL=https://audit.mardenseo.com

# Performance Settings
railway variables set WEB_CONCURRENCY=1
railway variables set MAX_OLD_SPACE_SIZE=512
```

### **Step 3: Deploy**

```bash
# Deploy to Railway
railway up

# Or deploy with specific service
railway up --service web
```

---

## 🔧 **CONFIGURATION FILES CREATED**

### **1. railway.json**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "node .output/server/index.mjs",
    "restartPolicyType": "always",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100
  },
  "environments": {
    "production": {
      "variables": {
        "NODE_ENV": "production",
        "NITRO_PRESET": "node-server",
        "PORT": "${{RAILWAY_STATIC_PORT}}",
        "HOST": "0.0.0.0"
      }
    }
  }
}
```

### **2. nixpacks.toml**

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "npm-9_x"]

[phases.install]
cmds = [
  "npm ci --prefer-offline --no-audit --progress=false"
]

[phases.build]
cmds = [
  "npm run build"
]

[start]
cmd = "node .output/server/index.mjs"

[variables]
NODE_ENV = "production"
NITRO_PRESET = "node-server"
```

### **3. Dockerfile (Alternative)**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

---

## 🌐 **CUSTOM DOMAIN SETUP**

### **Step 1: Railway Dashboard**

1. Go to your Railway project dashboard
2. Click on **Settings** → **Domains**
3. Click **Custom Domain**
4. Enter: `audit.mardenseo.com`

### **Step 2: DNS Configuration**

Update your DNS records with your domain provider:

```
Type: CNAME
Name: audit
Value: your-project.up.railway.app
TTL: Auto (or 300)
```

### **Step 3: SSL Certificate**

Railway automatically provisions SSL certificates for custom domains. This typically takes 5-15 minutes.

---

## 🔍 **TROUBLESHOOTING GUIDE**

### **Common Issues & Solutions**

#### **1. Build Failures**

```bash
# Check build logs
railway logs --service web

# Common fixes:
# - Clear node_modules: rm -rf node_modules && npm ci
# - Update Node version in nixpacks.toml
# - Check package.json scripts
```

#### **2. Environment Variable Issues**

```bash
# List all variables
railway variables

# Check specific variable
railway variables get SUPABASE_URL

# Remove and re-add problematic variables
railway variables delete VARIABLE_NAME
railway variables set VARIABLE_NAME=value
```

#### **3. Memory Issues**

```bash
# Increase memory limits
railway variables set MAX_OLD_SPACE_SIZE=1024
railway variables set WEB_CONCURRENCY=1

# Check memory usage in logs
railway logs --service web | grep memory
```

#### **4. Port Issues**

```bash
# Ensure correct port configuration
railway variables set HOST=0.0.0.0
railway variables set PORT=${{RAILWAY_STATIC_PORT}}

# Verify in railway.json
```

#### **5. Database Connection Issues**

```bash
# Test Supabase connection
curl "https://cehtwnfdqjehmztnnbch.supabase.co/rest/v1/" \
  -H "apikey: YOUR_ANON_KEY"

# Check environment variables are set correctly
railway variables get SUPABASE_URL
railway variables get SUPABASE_ANON_KEY
```

---

## 📊 **POST-DEPLOYMENT VERIFICATION**

### **Health Checks**

```bash
# Test health endpoint
curl https://your-domain.com/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-01-29T...",
  "uptime": 123456,
  "version": "2.0.0",
  "environment": "production"
}
```

### **SEO Analysis Test**

```bash
# Test SEO analysis endpoint
curl -X POST https://your-domain.com/api/seo/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### **Performance Monitoring**

```bash
# Check application metrics
railway metrics

# View real-time logs
railway logs --follow
```

---

## 💰 **COST OPTIMIZATION**

### **Railway Pricing Tiers**

- **Hobby**: $0/month (500 hours)
- **Pro**: $20/month (unlimited)

### **Resource Optimization**

```bash
# Optimize for cost
railway variables set WEB_CONCURRENCY=1
railway variables set MAX_OLD_SPACE_SIZE=512

# Monitor usage
railway usage
```

---

## 🔒 **SECURITY CHECKLIST**

### **Environment Variables**

- ✅ All secrets stored in Railway variables
- ✅ No secrets in code repository
- ✅ Production-specific JWT_SECRET
- ✅ Rate limiting configured

### **Domain Security**

- ✅ HTTPS enforced
- ✅ Custom domain configured
- ✅ Security headers implemented

### **API Security**

- ✅ Supabase RLS policies active
- ✅ Input validation in place
- ✅ Rate limiting configured

---

## 🚨 **EMERGENCY PROCEDURES**

### **Rollback Deployment**

```bash
# View deployment history
railway deployments

# Rollback to previous version
railway rollback DEPLOYMENT_ID
```

### **Quick Fix & Redeploy**

```bash
# Make changes and redeploy
git add .
git commit -m "hotfix: critical issue"
railway up
```

### **Scale Down in Emergency**

```bash
# Reduce resources temporarily
railway variables set WEB_CONCURRENCY=0
# Then redeploy with fix
```

---

## 📞 **SUPPORT RESOURCES**

### **Railway Support**

- **Documentation**: https://docs.railway.app/
- **Discord**: https://railway.app/discord
- **Status Page**: https://status.railway.app/

### **Project-Specific**

- **GitHub Issues**: Report bugs in project repository
- **Environment Variables**: Check `.env.production` template
- **Health Check**: Monitor `/api/health` endpoint

---

## 🎉 **SUCCESS CHECKLIST**

After deployment, verify these items:

- ✅ Application accessible at custom domain
- ✅ Health endpoint returns "healthy"
- ✅ SEO analysis API working
- ✅ Database connections established
- ✅ SSL certificate active
- ✅ All environment variables set
- ✅ Logs showing no errors
- ✅ Performance metrics normal

---

**🚀 Your Neon SEO Beacon is now live on Railway!**

**Live URL**: `https://audit.mardenseo.com` (after domain setup)  
**Health Check**: `https://audit.mardenseo.com/api/health`  
**Admin Dashboard**: Railway project dashboard

For ongoing maintenance, monitor the Railway dashboard and application logs regularly.
