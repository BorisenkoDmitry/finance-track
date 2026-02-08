@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo Building frontend...
call npm run build > build.log 2>&1

if errorlevel 1 (
    echo.
    echo === BUILD FAILED ===
    echo.
    type build.log | findstr /i "error"
    echo.
    echo Full log saved to build.log
    pause
    exit /b 1
) else (
    echo.
    echo === BUILD SUCCESSFUL ===
    del build.log 2>nul
)
