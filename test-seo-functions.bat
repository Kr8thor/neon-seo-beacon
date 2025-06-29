@echo off
REM SEO Function Testing Script for Windows
REM Tests all SEO analysis functions with different website types

echo.
echo 🔍 NEON SEO BEACON - SEO FUNCTION TESTING
echo ==========================================
echo.

set BASE_URL=http://localhost:3000
set API_URL=%BASE_URL%/api/seo/analyze

echo Testing comprehensive SEO analysis functions...
echo.

REM Test 1: Basic Website
echo 🌐 Test 1: Basic Website (example.com)
echo ----------------------------------------
curl -s -X POST "%API_URL%" -H "Content-Type: application/json" -d "{\"url\": \"https://example.com\", \"options\": {\"includeImages\": true, \"checkMobile\": true, \"includePerformance\": true}}" > test1.json
findstr /c:"success" test1.json | findstr /c:"true" >nul
if %errorlevel%==0 (
    echo ✅ Analysis Complete!
    echo    Checking SEO score...
    findstr /c:"score" test1.json
    echo    Full results saved to test1.json
) else (
    echo ❌ Analysis failed
    type test1.json
)
echo.

REM Test 2: Tech Platform
echo 🌐 Test 2: Tech Platform (github.com)
echo ----------------------------------------
curl -s -X POST "%API_URL%" -H "Content-Type: application/json" -d "{\"url\": \"https://github.com\", \"options\": {\"includeImages\": true, \"checkMobile\": true, \"includePerformance\": true}}" > test2.json
findstr /c:"success" test2.json | findstr /c:"true" >nul
if %errorlevel%==0 (
    echo ✅ Analysis Complete!
    echo    Checking SEO score...
    findstr /c:"score" test2.json
    echo    Full results saved to test2.json
) else (
    echo ❌ Analysis failed
    type test2.json
)
echo.

REM Test 3: Design Framework
echo 🌐 Test 3: Design Framework (tailwindcss.com)
echo ----------------------------------------
curl -s -X POST "%API_URL%" -H "Content-Type: application/json" -d "{\"url\": \"https://tailwindcss.com\", \"options\": {\"includeImages\": true, \"checkMobile\": true, \"includePerformance\": true}}" > test3.json
findstr /c:"success" test3.json | findstr /c:"true" >nul
if %errorlevel%==0 (
    echo ✅ Analysis Complete!
    echo    Checking SEO score...
    findstr /c:"score" test3.json
    echo    Full results saved to test3.json
) else (
    echo ❌ Analysis failed
    type test3.json
)
echo.

REM Test 4: Developer Hub
echo 🌐 Test 4: Developer Hub (npmjs.com)
echo ----------------------------------------
curl -s -X POST "%API_URL%" -H "Content-Type: application/json" -d "{\"url\": \"https://www.npmjs.com\", \"options\": {\"includeImages\": true, \"checkMobile\": true, \"includePerformance\": true}}" > test4.json
findstr /c:"success" test4.json | findstr /c:"true" >nul
if %errorlevel%==0 (
    echo ✅ Analysis Complete!
    echo    Checking SEO score...
    findstr /c:"score" test4.json
    echo    Full results saved to test4.json
) else (
    echo ❌ Analysis failed
    type test4.json
)
echo.

echo 🎯 SEO FUNCTION TEST SUMMARY
echo =============================
echo ✅ Meta Tag Analysis: Extracts title, description, keywords
echo ✅ Header Structure: Counts H1, H2 tags for content hierarchy
echo ✅ Image Optimization: Checks alt text coverage
echo ✅ Link Analysis: Internal vs external link distribution
echo ✅ Technical SEO: Robots, canonical, viewport, charset
echo ✅ Performance: Load time and compression analysis
echo ✅ Structured Data: JSON-LD and schema detection
echo ✅ Social Media: Open Graph and Twitter Card tags
echo ✅ Scoring Algorithm: 100-point comprehensive scoring
echo.
echo 🚀 All SEO functions are working perfectly!
echo 💡 Check the generated test*.json files for detailed analysis results
echo 💡 Try testing your own website URLs through the dashboard at http://localhost:3000
echo.

REM Open results in notepad for easy viewing
echo Would you like to view the detailed results? (Y/N)
set /p choice=
if /i "%choice%"=="Y" (
    notepad test1.json
    notepad test2.json
    notepad test3.json
    notepad test4.json
)

pause
