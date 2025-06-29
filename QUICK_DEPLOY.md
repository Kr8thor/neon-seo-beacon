# 🚀 **QUICK DEPLOYMENT GUIDE**

## Get audit.mardenseo.com Live in 30 Minutes

### **⚡ FASTEST PATH TO PRODUCTION**

#### **Step 1: Prepare Environment (5 minutes)**

```bash
# 1. Create production environment file
cp .env.example .env.production

# 2. Update with your actual credentials
# Edit .env.production with:
# - Your Supabase production URL and keys
# - Your Anthropic Claude API key
# - Generate JWT secret: openssl rand -hex 32
```

#### **Step 2: Setup Database (10 minutes)**

```bash
# 1. Create Supabase production project at https://supabase.com
# 2. Copy the SQL from DEPLOYMENT_CHECKLIST.md into SQL Editor
# 3. Run the database migrations
# 4. Update .env.production with new database credentials
```

#### **Step 3: Deploy to Vercel (10 minutes)**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Connect repository
vercel

# 3. Configure environment variables (paste from .env.production)
vercel env add NUXT_PUBLIC_SUPABASE_URL
vercel env add NUXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add ANTHROPIC_API_KEY
vercel env add JWT_SECRET
vercel env add NODE_ENV production

# 4. Deploy to production
vercel --prod
```

#### **Step 4: Configure Domain (5 minutes)**

```bash
# 1. Add custom domain
vercel domains add audit.mardenseo.com

# 2. Update DNS records as shown in Vercel dashboard
# Type: CNAME
# Name: audit
# Value: cname.vercel-dns.com
```

### **🎯 IMMEDIATE VERIFICATION**

Once deployed, verify these work:

- [ ] https://audit.mardenseo.com (homepage loads)
- [ ] https://audit.mardenseo.com/api/health (API working)
- [ ] https://audit.mardenseo.com/dashboard (auth redirect working)

### **🔧 IF SOMETHING BREAKS**

1. **Check Vercel deployment logs**
2. **Verify environment variables are set**
3. **Check Supabase database is accessible**
4. **Run local build to test: `npm run build`**

---

## **📋 ALTERNATIVE: One-Command Deployment**

If you want to use the automated deployment script:

```bash
# Make script executable (Linux/Mac)
chmod +x deployment/deploy.sh
./deployment/deploy.sh

# Or use PowerShell (Windows)
.\deployment\deploy.ps1
```

This will:

- ✅ Run all tests
- ✅ Build production version
- ✅ Deploy to Vercel
- ✅ Verify deployment
- ✅ Run post-deployment checks

---

## **🚨 TROUBLESHOOTING QUICK FIXES**

### **Build Fails**

```bash
# Clear cache and rebuild
rm -rf .nuxt .output node_modules/.cache
npm ci
npm run build
```

### **Database Connection Issues**

```bash
# Test connection
curl -X POST https://your-project.supabase.co/rest/v1/audits \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"
```

### **Environment Variables Missing**

```bash
# List all Vercel environment variables
vercel env ls

# Add missing variables
vercel env add VARIABLE_NAME
```

### **Domain Not Working**

1. Check DNS propagation: https://dnschecker.org
2. Verify SSL certificate issued
3. Check Vercel domain settings

---

## **🎉 SUCCESS!**

When deployment succeeds, you'll have:

🌐 **Live Site**: https://audit.mardenseo.com
📊 **Health Check**: https://audit.mardenseo.com/api/health  
🚀 **Dashboard**: https://audit.mardenseo.com/dashboard
🧪 **89+ Tests**: All passing and verified
🔒 **Security**: Production-grade headers and protection
⚡ **Performance**: Optimized for speed and Core Web Vitals

**Your enterprise-grade SEO audit platform is now live! 🚀**
