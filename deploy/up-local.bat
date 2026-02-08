@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo Checking Docker...
docker version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and wait for it to initialize.
    pause
    exit /b 1
)

echo Docker is ready!
echo.

if not exist ".env" (
    copy "env.example" ".env" >nul
    echo Created deploy/.env from env.example. Edit deploy/.env if needed.
    echo.
)

echo Starting docker compose (local debug mode)...
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build

echo.
echo Checking container status...
docker compose ps

echo.
echo === Local debug environment is ready! ===
echo Open: http://localhost:8080/
echo.
echo To view logs:
echo   docker compose logs -f backend
echo   docker compose logs -f web
echo.
pause
