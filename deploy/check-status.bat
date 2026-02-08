@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo === Finance Track - Container Status ===
echo.

echo Container status:
docker compose -f docker-compose.yml -f docker-compose.local.yml ps
echo.

echo === Recent logs (last 20 lines) ===
echo.

echo --- Web (Frontend) ---
docker compose logs --tail 20 web
echo.

echo --- Backend ---
docker compose logs --tail 20 backend
echo.

echo --- Database ---
docker compose logs --tail 10 db
echo.

echo === Health Check ===
echo Testing frontend: http://localhost:8080/
curl -s -o nul -w "Frontend status: %%{http_code}\n" http://localhost:8080/ 2>nul || echo Frontend: Not responding
echo.

echo Testing backend: http://localhost:3000/
curl -s -o nul -w "Backend status: %%{http_code}\n" http://localhost:3000/ 2>nul || echo Backend: Not responding
echo.

pause
