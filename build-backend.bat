@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"
cd backend
echo Building backend...
call npm run build
if errorlevel 1 (
    echo Backend build failed!
    pause
    exit /b 1
)
echo Backend build successful!
cd ..
