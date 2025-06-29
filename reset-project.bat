@echo off
echo ========================================
echo  Neon SEO Beacon - Project Reset Script
echo ========================================
echo.

cd /d "C:\Users\Leo\neon-seo-beacon"

echo [1/6] Cleaning conflicting files...
if exist "index.html" del /f /q "index.html"
if exist "tsconfig.app.json" del /f /q "tsconfig.app.json"
if exist "tsconfig.node.json" del /f /q "tsconfig.node.json"
if exist "vite.config.js" del /f /q "vite.config.js"
if exist "vite.config.ts" del /f /q "vite.config.ts"
if exist "src" rmdir /s /q "src"
echo ✓ Conflicting files removed

echo.
echo [2/6] Cleaning npm cache...
npm cache clean --force
echo ✓ npm cache cleaned

echo.
echo [3/6] Removing problematic dependencies...
if exist "node_modules" (
    echo Attempting to remove node_modules... This may take a while.
    rmdir /s /q "node_modules" 2>nul
    if exist "node_modules" (
        echo Warning: Could not fully remove node_modules. Some files may be locked.
        echo You may need to restart your computer and run this script again.
    ) else (
        echo ✓ node_modules removed successfully
    )
)

if exist "package-lock.json" del /f /q "package-lock.json"
echo ✓ package-lock.json removed

echo.
echo [4/6] Installing fresh dependencies...
npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm install failed. Trying with --legacy-peer-deps...
    npm install --legacy-peer-deps
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ npm install still failing. Trying yarn instead...
        npm install -g yarn
        yarn install
    )
)

echo.
echo [5/6] Checking environment configuration...
if not exist ".env" (
    echo ⚠️  No .env file found. Copying from .env.example...
    copy ".env.example" ".env"
    echo ✓ .env file created from example
    echo.
    echo 🚨 IMPORTANT: Please edit .env file with your actual API keys:
    echo    - SUPABASE_URL
    echo    - SUPABASE_ANON_KEY
    echo    - SUPABASE_SERVICE_ROLE_KEY
    echo    - ANTHROPIC_API_KEY
    echo    - GOOGLE_PAGESPEED_API_KEY
    echo.
) else (
    echo ✓ .env file exists
)

echo.
echo [6/6] Starting development server...
echo ✓ Setup complete! Starting Nuxt development server...
echo.
npm run dev

pause
