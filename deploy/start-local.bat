@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo === Finance Track - Local Development Setup ===
echo.

echo Checking Docker...
docker version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Desktop is not running!
    echo Please start Docker Desktop and wait for it to initialize.
    pause
    exit /b 1
)
echo Docker is ready!
echo.

if not exist ".env" (
    echo Creating .env from env.example...
    copy "env.example" ".env" >nul
    echo .env created!
) else (
    echo .env already exists, skipping creation.
)
echo.

echo Stopping existing containers (if any)...
docker compose -f docker-compose.yml -f docker-compose.local.yml down >nul 2>&1
echo.

echo Building and starting containers...
echo This may take 5-10 minutes on first run...
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Failed to start containers!
    echo ========================================
    echo.
    echo Showing build logs for web service:
    docker compose logs web
    echo.
    echo Showing build logs for backend service:
    docker compose logs backend
    echo.
    echo To see full logs, run:
    echo   docker compose logs web
    echo   docker compose logs backend
    pause
    exit /b 1
)

echo.
echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo === Container Status ===
docker compose ps

echo.
echo === Local Development Environment Ready! ===
echo.
echo Frontend (Nginx):  http://localhost:8080/
echo Backend API:       http://localhost:3000/
echo PostgreSQL:        localhost:5432
echo.
echo To view logs:
echo   docker compose logs -f backend
echo   docker compose logs -f web
echo.
echo To stop:
echo   docker compose -f docker-compose.yml -f docker-compose.local.yml down
echo.
pause
