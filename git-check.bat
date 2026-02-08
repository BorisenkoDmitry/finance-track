@echo off
chcp 65001 >nul 2>&1
cd /d "F:\Для работы\save-easily"

echo ========================================
echo Git Repository Check
echo ========================================
echo.

if not exist ".git" (
    echo [ERROR] Git repository not found in current directory!
    echo.
    echo To initialize git repository, run:
    echo   git init
    echo.
    pause
    exit /b 1
)

echo [OK] Git repository found
echo.

echo ========================================
echo Checking if ContentHeader.tsx is tracked:
echo ========================================
git ls-files "frontend\src\components\Layouts\ContentHeader\ContentHeader.tsx"

if errorlevel 1 (
    echo.
    echo [INFO] File is NOT tracked by git
    echo.
    echo To add it, run:
    echo   git add "frontend\src\components\Layouts\ContentHeader\ContentHeader.tsx"
) else (
    echo.
    echo [OK] File IS tracked by git
)

echo.
echo ========================================
echo Current git status:
echo ========================================
git status --short

echo.
echo ========================================
echo Checking .gitignore:
echo ========================================
if exist ".gitignore" (
    type .gitignore | findstr /i "ContentHeader"
    if errorlevel 1 (
        echo [OK] ContentHeader.tsx is NOT in .gitignore
    ) else (
        echo [WARNING] ContentHeader.tsx might be ignored!
    )
) else (
    echo [INFO] No .gitignore file found
)

echo.
pause
