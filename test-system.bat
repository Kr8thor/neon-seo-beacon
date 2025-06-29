@echo off
echo =====================================
echo  Neon SEO Beacon - System Test
echo =====================================
echo.

cd /d "C:\Users\Leo\neon-seo-beacon"

echo [1/4] Testing Health API...
curl -X GET http://localhost:3000/api/health -H "Content-Type: application/json"
echo.
echo.

echo [2/4] Testing SEO Analysis API...
curl -X POST http://localhost:3000/api/seo/analyze ^
  -H "Content-Type: application/json" ^
  -d "{\"url\": \"https://example.com\", \"options\": {\"includeImages\": true, \"checkMobile\": true}}"
echo.
echo.

echo [3/4] Testing Database Connection...
curl -X GET http://localhost:3000/api/database/test -H "Content-Type: application/json"
echo.
echo.

echo [4/4] Opening Application in Browser...
start http://localhost:3000
echo.

echo ✓ System test complete!
echo.
echo If you see healthy responses above, your Neon SEO Beacon is working correctly!
echo.
pause
