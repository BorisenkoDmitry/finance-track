@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"
cd frontend
echo Building frontend...
call npm run build
if errorlevel 1 (
    echo Frontend build failed!
    pause
    exit /b 1
)
echo Frontend build successful!
cd ..
