@echo off
chcp 65001 >nul 2>&1
cd /d "F:\Для работы\save-easily"

echo Checking git status...
echo.

if not exist ".git" (
    echo Git repository not found. Initializing...
    git init
    echo.
)

echo Current directory: %CD%
echo.

git status --short

echo.
echo Checking ContentHeader.tsx specifically:
git status --short "frontend\src\components\Layouts\ContentHeader\ContentHeader.tsx"

pause
