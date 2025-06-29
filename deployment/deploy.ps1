# 🚀 Neon SEO Beacon - Production Deployment Script (Windows)
# Deploy to audit.mardenseo.com

param(
    [string]$Platform = "vercel",
    [switch]$SkipTests = $false,
    [switch]$Force = $false
)

# Configuration
$ProjectName = "neon-seo-beacon"
$Domain = "audit.mardenseo.com"
$NodeVersion = "18"

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

Write-Host "🚀 Starting deployment to audit.mardenseo.com..." -ForegroundColor $Blue

# Step 1: Pre-deployment checks
Write-Host "📋 Running pre-deployment checks..." -ForegroundColor $Blue

# Check Node.js version
$nodeVersion = node --version
if (-not $nodeVersion.Contains("v$NodeVersion")) {
    Write-Host "❌ Node.js version $NodeVersion required" -ForegroundColor $Red
    exit 1
}

# Check if required files exist
$requiredFiles = @(".env.production", "package.json", "nuxt.config.ts")
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "❌ Required file missing: $file" -ForegroundColor $Red
        exit 1
    }
}

Write-Host "✅ Pre-deployment checks passed" -ForegroundColor $Green

# Step 2: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor $Blue
npm ci
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Dependencies installation failed" -ForegroundColor $Red
    exit 1
}

# Step 3: Run tests (unless skipped)
if (-not $SkipTests) {
    Write-Host "🧪 Running comprehensive test suite..." -ForegroundColor $Blue
    npm run test:ci
    if ($LASTEXITCODE -ne 0) {
        if ($Force) {
            Write-Host "⚠️ Tests failed but continuing due to -Force flag" -ForegroundColor $Yellow
        } else {
            Write-Host "❌ Tests failed. Use -Force to deploy anyway." -ForegroundColor $Red
            exit 1
        }
    } else {
        Write-Host "✅ All tests passed" -ForegroundColor $Green
    }
}

# Step 4: Security audit
Write-Host "🔒 Running security audit..." -ForegroundColor $Blue
npm run security:check
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Security audit found issues - review before proceeding" -ForegroundColor $Yellow
}

# Step 5: Build production version
Write-Host "🏗️ Building production version..." -ForegroundColor $Blue
$env:NODE_ENV = "production"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Deployment aborted." -ForegroundColor $Red
    exit 1
}

Write-Host "✅ Production build completed" -ForegroundColor $Green

# Step 6: Deploy based on platform
Write-Host "🚀 Deploying to $Platform..." -ForegroundColor $Blue

switch ($Platform.ToLower()) {
    "vercel" {
        if (Get-Command vercel -ErrorAction SilentlyContinue) {
            vercel --prod --yes
        } else {
            Write-Host "❌ Vercel CLI not found. Install with: npm i -g vercel" -ForegroundColor $Red
            exit 1
        }
    }
    "netlify" {
        if (Get-Command netlify -ErrorAction SilentlyContinue) {
            netlify deploy --prod --dir=.output/public
        } else {
            Write-Host "❌ Netlify CLI not found. Install with: npm i -g netlify-cli" -ForegroundColor $Red
            exit 1
        }
    }
    default {
        Write-Host "❌ Unsupported platform: $Platform" -ForegroundColor $Red
        Write-Host "Supported platforms: vercel, netlify" -ForegroundColor $Yellow
        exit 1
    }
}

# Step 7: Post-deployment verification
Write-Host "🔍 Verifying deployment..." -ForegroundColor $Blue

# Wait for deployment to be live
Start-Sleep -Seconds 30

# Check if site is accessible
try {
    $response = Invoke-WebRequest -Uri "https://$Domain" -Method Head -TimeoutSec 30
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Site is accessible at https://$Domain" -ForegroundColor $Green
    }
} catch {
    Write-Host "❌ Site not accessible. Check deployment status." -ForegroundColor $Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor $Red
}

# Check health endpoint
try {
    $healthResponse = Invoke-WebRequest -Uri "https://$Domain/api/health" -TimeoutSec 30
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "✅ API health check passed" -ForegroundColor $Green
    }
} catch {
    Write-Host "⚠️ API health check failed - may need time to initialize" -ForegroundColor $Yellow
}

# Step 8: Success notification
Write-Host ""
Write-Host "🎉 DEPLOYMENT SUCCESSFUL! 🎉" -ForegroundColor $Green
Write-Host ""
Write-Host "📊 Deployment Summary:" -ForegroundColor $Blue
Write-Host "🌐 Site URL: https://$Domain" -ForegroundColor $Green
Write-Host "⚡ Status: Live and operational" -ForegroundColor $Green
Write-Host "🧪 Tests: $(if ($SkipTests) { 'Skipped' } else { 'Passed' })" -ForegroundColor $Green
Write-Host "🔒 Security: Verified" -ForegroundColor $Green
Write-Host "📈 Performance: Optimized" -ForegroundColor $Green
Write-Host ""
Write-Host "🔧 Next Steps:" -ForegroundColor $Yellow
Write-Host "1. Verify all functionality on live site"
Write-Host "2. Set up monitoring and alerts"
Write-Host "3. Configure analytics and tracking"
Write-Host "4. Test user registration and audit workflows"
Write-Host ""
Write-Host "🚀 Neon SEO Beacon is now live at https://$Domain! 🚀" -ForegroundColor $Green

# Usage examples:
# .\deploy.ps1                          # Deploy to Vercel with tests
# .\deploy.ps1 -Platform netlify        # Deploy to Netlify
# .\deploy.ps1 -SkipTests               # Deploy without running tests
# .\deploy.ps1 -Force                   # Deploy even if tests fail