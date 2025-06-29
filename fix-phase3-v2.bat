@echo off
chcp 65001 >nul
echo ====================================
echo PHASE 3 COMPLETION SCRIPT V2
echo ====================================

echo Navigating to project directory...
cd /d "C:\Users\Leo\neon-seo-beacon"

echo.
echo [1/6] Installing Playwright browsers (if needed)...
call npx playwright install chromium firefox webkit
if %errorlevel% neq 0 (
    echo WARNING: Playwright browser installation had issues
    echo Continuing anyway...
)

echo.
echo [2/6] Installing additional dependencies...
call npm install -D wait-on axe-core @axe-core/playwright pixelmatch pngjs @types/pixelmatch
if %errorlevel% neq 0 (
    echo ERROR: Additional dependency installation failed
    pause
    exit /b 1
)

echo.
echo [3/6] Installing Lighthouse CI globally...
call npm install -g @lhci/cli@0.15.x
if %errorlevel% neq 0 (
    echo WARNING: Lighthouse CI installation failed (may need admin rights)
)

echo.
echo [4/6] Verifying Playwright installation...
call npx playwright --version
if %errorlevel% neq 0 (
    echo WARNING: Playwright verification had issues
)

echo.
echo [5/6] Creating test environment configuration...
if not exist .env.test (
    copy .env .env.test
    echo Created .env.test from .env
)

echo.
echo [6/6] Setting up development environment...
echo Skipping build for now due to rate limiting issues
echo Build has been temporarily disabled to focus on testing setup

echo.
echo ====================================
echo PHASE 3 SETUP COMPLETE!
echo ====================================
echo.
echo Next steps:
echo 1. Start server: npm run dev
echo 2. Wait for server to be ready: http://localhost:3000
echo 3. Run tests: npm run test:unit
echo 4. Run E2E tests: npm run test:e2e
echo 5. Run full suite: npm run test:all:phase3
echo.
echo NOTE: Build step skipped due to rate limiting during prerendering.
echo The rate limiting has been fixed, so build should work now if needed.
echo.
pause
