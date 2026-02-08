@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo === Stopping existing containers ===
docker compose -f docker-compose.yml -f docker-compose.local.yml down
echo.

echo === Building and starting containers ===
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
if errorlevel 1 (
    echo.
    echo === BUILD FAILED - Showing logs ===
    echo.
    echo --- Web (Frontend) logs ---
    docker compose logs web --tail 100
    echo.
    echo --- Backend logs ---
    docker compose logs backend --tail 100
    echo.
    echo --- Database logs ---
    docker compose logs db --tail 50
    pause
    exit /b 1
)

echo.
echo Waiting 15 seconds for services to start...
timeout /t 15 /nobreak >nul

echo.
echo === Container Status ===
docker compose ps

echo.
echo === Checking logs for errors ===
echo.

echo --- Web (Frontend) recent logs ---
docker compose logs web --tail 30
echo.

echo --- Backend recent logs ---
docker compose logs backend --tail 30
echo.

echo === Services should be running ===
echo Frontend: http://localhost:8080/
echo Backend: http://localhost:3000/
echo.
pause
