# 🚀 **RAILWAY DEPLOYMENT GUIDE**

## Deploy Neon SEO Beacon to audit.mardenseo.com

### **Step 1: Setup Railway Account**

```bash
# 1. Sign up at https://railway.app
# 2. Install Railway CLI
npm install -g @railway/cli

# 3. Login
railway login
```

### **Step 2: Prepare Your Project**

```bash
# 1. Create railway.json configuration
# (File will be created below)

# 2. Update package.json scripts
# Add: "start": "node .output/server/index.mjs"
```

### **Step 3: Deploy**

```bash
# 1. Initialize Railway project
railway init

# 2. Set environment variables
railway variables set NUXT_PUBLIC_SUPABASE_URL=your_url
railway variables set NUXT_PUBLIC_SUPABASE_ANON_KEY=your_key
railway variables set SUPABASE_SERVICE_ROLE_KEY=your_service_key
railway variables set ANTHROPIC_API_KEY=your_claude_key
railway variables set JWT_SECRET=your_jwt_secret
railway variables set NODE_ENV=production

# 3. Deploy
railway up
```

### **Step 4: Custom Domain**

```bash
# 1. Add custom domain in Railway dashboard
# 2. Update DNS records:
# Type: CNAME
# Name: audit
# Value: your-project.up.railway.app

# 3. Railway will automatically provision SSL
```

### **Railway Configuration File**

Create this as `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "node .output/server/index.mjs",
    "restartPolicyType": "always"
  }
}
```

### **Expected Costs**

- **Development**: $0 (Railway has generous free tier)
- **Production Launch**: $10-15/month
- **Growing Business**: $25-50/month
- **Scale**: $75-150/month

### **Benefits Over Vercel**

✅ No 60-second timeout limits
✅ More predictable pricing
✅ Better for long-running processes
✅ Excellent customer support
✅ Built-in monitoring and logs
