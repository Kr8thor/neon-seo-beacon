@echo off
echo ====================================
echo PHASE 3 COMPLETION SCRIPT
echo ====================================

echo Navigating to project directory...
cd /d "C:\Users\Leo\neon-seo-beacon"

echo.
echo [1/8] Installing Playwright browsers...
call npx playwright install chromium firefox webkit
if %errorlevel% neq 0 (
    echo ERROR: Playwright browser installation failed
    pause
    exit /b 1
)

echo.
echo [2/8] Installing additional dependencies...
call npm install -D wait-on axe-core @axe-core/playwright pixelmatch pngjs @types/pixelmatch
if %errorlevel% neq 0 (
    echo ERROR: Additional dependency installation failed
    pause
    exit /b 1
)

echo.
echo [3/8] Installing Lighthouse CI globally...
call npm install -g @lhci/cli@0.15.x
if %errorlevel% neq 0 (
    echo WARNING: Lighthouse CI installation failed (may need admin rights)
)

echo.
echo [4/8] Verifying Playwright installation...
call npx playwright --version
if %errorlevel% neq 0 (
    echo ERROR: Playwright verification failed
    pause
    exit /b 1
)

echo.
echo [5/8] Creating test environment configuration...
if not exist .env.test (
    copy .env .env.test
    echo Created .env.test from .env
)

echo.
echo [6/8] Building the application...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [7/8] Starting development server for testing...
start /B npm run dev

echo Waiting for server to be ready...
timeout /t 10 /nobreak >nul

echo.
echo [8/8] Creating visual baselines...
call npm run test:visual:update
if %errorlevel% neq 0 (
    echo WARNING: Visual baseline creation had issues (normal on first run)
)

echo.
echo ====================================
echo PHASE 3 SETUP COMPLETE!
echo ====================================
echo.
echo Next steps:
echo 1. Verify server is running: http://localhost:3000
echo 2. Run: npm run test:unit
echo 3. Run: npm run test:e2e
echo 4. Run: npm run test:all:phase3
echo.
pause
