# 🪟 Windows Setup Fix - Neon SEO Beacon

**Error:** `Only URLs with a scheme in: file, data, and node are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'c:'`

This error occurs on Windows when Node.js ESM module loader encounters incorrect path formatting.

---

## ✅ Quick Fix (5 minutes)

### Step 1: Clean Installation

```powershell
# Navigate to project directory
cd C:\Users\Leo\neon-seo-beacon

# Remove node_modules and lock files
Remove-Item -Recurse -Force node_modules, .nuxt, .output -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Clear npm cache
npm cache clean --force

# Reinstall with exact versions
npm install
```

### Step 2: Verify Node.js Version

```powershell
# Check Node.js version (must be >= 20.18.1)
node -v

# If version is wrong, install correct version:
# Download from: https://nodejs.org/en/download/
# Or use nvm-windows: https://github.com/coreybutler/nvm-windows
```

### Step 3: Set Environment Variables

Create `.env` file in project root (`C:\Users\Leo\neon-seo-beacon\.env`):

```bash
# Supabase Configuration (CORRECT PROJECT)
SUPABASE_URL=https://qyspmedutegwcdwlbbot.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5c3BtZWR1dGVnd2Nkd2xiYm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MzQ1NTgsImV4cCI6MjA3OTMxMDU1OH0.DHayxPYKp6EiWsBvUxWAtsk3lr8REt2ADpIL-L1ggb8
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Security Secrets (generate these)
JWT_SECRET=generate-with-openssl-rand-base64-32
CSRF_SECRET=generate-with-openssl-rand-base64-32

# System User
PUBLIC_USER_ID=00000000-0000-0000-0000-000000000001

# Node Environment
NODE_ENV=development
PORT=3000
```

**Generate secrets with Git Bash (if installed):**
```bash
openssl rand -base64 32
```

**Or use PowerShell:**
```powershell
# Generate JWT_SECRET
$bytes = New-Object byte[] 32
(New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
[Convert]::ToBase64String($bytes)

# Generate CSRF_SECRET (run again)
$bytes = New-Object byte[] 32
(New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

### Step 4: Start Development Server

```powershell
# Using npm
npm run dev

# Or specify port explicitly
$env:PORT=3000; npm run dev
```

---

## 🔍 Troubleshooting Specific Errors

### Error: "Cannot find module" or "ERR_MODULE_NOT_FOUND"

**Cause:** Module resolution issue with Windows paths

**Fix:**
```powershell
# Clear all caches
npm cache clean --force
Remove-Item -Recurse -Force .nuxt, .output
npm install
```

### Error: Port 3000 already in use

**Fix:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /F /PID <PID>

# Or use a different port
$env:PORT=3001; npm run dev
```

### Error: "EACCES: permission denied"

**Fix:**
```powershell
# Run PowerShell as Administrator
# Navigate to project
cd C:\Users\Leo\neon-seo-beacon

# Reset permissions
icacls . /reset /T /C

# Then try npm install again
npm install
```

### Error: "NODE_ENV is not recognized"

**Fix:** Use PowerShell syntax (not bash):
```powershell
# PowerShell (correct)
$env:NODE_ENV="development"; npm run dev

# Git Bash (if using Git Bash on Windows)
NODE_ENV=development npm run dev
```

---

## 🛠️ Advanced Fixes

### Fix 1: Update Nuxt Config for Windows Compatibility

The current `nuxt.config.ts` should work, but if issues persist, ensure these settings are present:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // ... other config

  vite: {
    // Windows-specific optimizations
    server: {
      watch: {
        usePolling: true, // Better for Windows file watching
      },
      port: Number(process.env.PORT) || 3000,
      host: '0.0.0.0'
    },
    resolve: {
      // Ensure proper path resolution on Windows
      alias: {
        '~': fileURLToPath(new URL('./', import.meta.url)),
        '@': fileURLToPath(new URL('./', import.meta.url))
      }
    }
  }
})
```

### Fix 2: Use WSL2 (Windows Subsystem for Linux)

If Windows-specific issues persist, consider using WSL2 for better Node.js compatibility:

```powershell
# Install WSL2 (PowerShell as Administrator)
wsl --install

# After restart, install Node.js in WSL2
# Open Ubuntu terminal:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and run project in WSL2
cd ~
git clone https://github.com/Kr8thor/neon-seo-beacon.git
cd neon-seo-beacon
npm install
npm run dev
```

### Fix 3: Check for Path Issues in imports

If specific files are causing issues, check for incorrect path formats:

**❌ Wrong:**
```javascript
import something from 'C:\\Users\\Leo\\...'
```

**✅ Correct:**
```javascript
import something from '~/path/to/file'
import something from '@/path/to/file'
```

---

## 📝 Verification Checklist

After applying fixes, verify:

- [ ] Node.js version is 20.18.1 or higher (`node -v`)
- [ ] npm version is 10.0.0 or higher (`npm -v`)
- [ ] `.env` file exists with correct values
- [ ] `node_modules` folder is fresh (deleted and reinstalled)
- [ ] `.nuxt` and `.output` folders are deleted
- [ ] No other process is using port 3000
- [ ] TypeScript checks pass: `npm run type-check`
- [ ] Dev server starts: `npm run dev`

---

## 🚀 Expected Output

When successful, you should see:

```
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/

Nuxt 3.9.3 with Nitro 2.x.x

ℹ Vite client warmed up in xxxms
✔ Vite server built in xxxms
✔ Nuxt Nitro server built in xxxms
```

Then open browser to: **http://localhost:3000**

---

## 🆘 Still Having Issues?

### Check these files for Windows-specific problems:

1. **node_modules**
   - Size should be ~500MB
   - If smaller, installation failed

2. **package-lock.json**
   - Should exist
   - If missing, run `npm install`

3. **.nuxt folder**
   - Auto-generated on first run
   - Delete if corrupted: `Remove-Item -Recurse -Force .nuxt`

### Get detailed logs:

```powershell
# Enable debug mode
$env:DEBUG="*"; npm run dev

# Check for port conflicts
netstat -ano | findstr :3000

# Test Supabase connection
curl https://qyspmedutegwcdwlbbot.supabase.co
```

---

## 📚 Additional Resources

- **Node.js Windows Issues:** https://github.com/nodejs/help/issues
- **Nuxt 3 on Windows:** https://nuxt.com/docs/getting-started/installation
- **WSL2 Setup:** https://docs.microsoft.com/en-us/windows/wsl/install

---

## ✅ Success Criteria

Your setup is working when:

1. ✅ `npm run dev` starts without errors
2. ✅ Browser opens to http://localhost:3000
3. ✅ No console errors in terminal
4. ✅ No errors in browser DevTools (F12)
5. ✅ Homepage loads with "Neon SEO Beacon" branding

---

**Quick Commands Summary:**

```powershell
# Full reset
Remove-Item -Recurse -Force node_modules, .nuxt, .output
npm cache clean --force
npm install

# Generate secrets
$bytes = New-Object byte[] 32; (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); [Convert]::ToBase64String($bytes)

# Start dev server
npm run dev

# Check if working
curl http://localhost:3000/api/health
```

---

**Last Updated:** November 21, 2025  
**Tested On:** Windows 11, Node.js 20.18.1, npm 10.0.0
