@echo off
echo ===================================
echo   Neon SEO Beacon - System Tests
echo ===================================
echo.

echo Testing Health Endpoint...
curl.exe -s http://localhost:3003/api/health | findstr "status"
echo.

echo Testing System Metrics...
curl.exe -s http://localhost:3003/api/system/metrics | findstr "success"
echo.

echo Testing Circuit Breakers...
curl.exe -s http://localhost:3003/api/system/circuit-breakers | findstr "total"
echo.

echo Testing SEO Analysis - Google.com...
curl.exe -X POST -H "Content-Type: application/json" -d "{\"url\":\"https://google.com\",\"options\":{\"includeImages\":true}}" http://localhost:3003/api/seo/analyze | findstr "success"
echo.

echo Testing SEO Analysis - Fast Site...
curl.exe -X POST -H "Content-Type: application/json" -d "{\"url\":\"https://httpbin.org/html\",\"options\":{\"includeImages\":true}}" http://localhost:3003/api/seo/analyze | findstr "score"
echo.

echo ===================================
echo   All Tests Complete!
echo ===================================
pause