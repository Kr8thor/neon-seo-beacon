@echo off
echo ====================================
echo PHASE 3 VERIFICATION SCRIPT
echo ====================================

cd /d "C:\Users\Leo\neon-seo-beacon"

echo.
echo [1/10] Checking project structure...
if exist "tests\e2e" (
    echo ✅ E2E test directory exists
) else (
    echo ❌ E2E test directory missing
)

if exist "playwright.config.ts" (
    echo ✅ Playwright config exists
) else (
    echo ❌ Playwright config missing
)

if exist "vitest.config.ts" (
    echo ✅ Vitest config exists  
) else (
    echo ❌ Vitest config missing
)

echo.
echo [2/10] Checking test files...
if exist "tests\unit\utils\seo.test.ts" (
    echo ✅ Unit tests exist
) else (
    echo ❌ Unit tests missing
)

if exist "tests\integration\api\health.test.ts" (
    echo ✅ Integration tests exist
) else (
    echo ❌ Integration tests missing
)

if exist "tests\e2e\user-flows\audit-creation.spec.ts" (
    echo ✅ E2E tests exist
) else (
    echo ❌ E2E tests missing
)

echo.
echo [3/10] Checking dependencies...
call npm list @playwright/test >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Playwright installed
) else (
    echo ❌ Playwright not installed
)

call npm list vitest >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Vitest installed
) else (
    echo ❌ Vitest not installed
)

echo.
echo [4/10] Checking Playwright browsers...
call npx playwright install --dry-run >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Playwright browsers available
) else (
    echo ❌ Playwright browsers need installation
)

echo.
echo [5/10] Checking environment files...
if exist ".env" (
    echo ✅ .env exists
) else (
    echo ❌ .env missing
)

if exist ".env.test" (
    echo ✅ .env.test exists
) else (
    echo ❌ .env.test missing
)

echo.
echo [6/10] Checking scripts...
call npm run test:unit --help >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Unit test script works
) else (
    echo ❌ Unit test script has issues
)

echo.
echo [7/10] Testing basic functionality...
call npm run type-check >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ TypeScript compilation passes
) else (
    echo ❌ TypeScript compilation issues
)

echo.
echo [8/10] Checking server health...
call curl -s http://localhost:3000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Development server responding
) else (
    echo ⚠️ Development server not running
)

echo.
echo [9/10] Checking test structure...
for /f %%i in ('dir /b /s tests\*.test.ts tests\*.spec.ts 2^>nul ^| find /c /v ""') do set TEST_COUNT=%%i
echo ✅ Found %TEST_COUNT% test files

echo.
echo [10/10] Final verification...
if exist "scripts\test-phase3.js" (
    echo ✅ Phase 3 test runner exists
) else (
    echo ❌ Phase 3 test runner missing
)

echo.
echo ====================================
echo VERIFICATION COMPLETE
echo ====================================
echo.
echo Next steps to complete Phase 3:
echo 1. Run: .\fix-phase3.bat
echo 2. Start server: npm run dev
echo 3. Run tests: node scripts\test-phase3.js
echo 4. Or run: npm run test:all:phase3
echo.
pause
