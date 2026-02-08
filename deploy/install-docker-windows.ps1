# Автоматическая установка Docker Desktop на Windows
# Требует: PowerShell от имени администратора

Write-Host "=== Установка Docker Desktop для Windows ===" -ForegroundColor Cyan
Write-Host ""

# Проверка прав администратора
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ОШИБКА: Скрипт должен быть запущен от имени администратора!" -ForegroundColor Red
    Write-Host "Правый клик на PowerShell -> Запуск от имени администратора" -ForegroundColor Yellow
    exit 1
}

# 1) Проверка/установка WSL2
Write-Host "[1/4] Проверка WSL2..." -ForegroundColor Yellow
try {
    $wslStatus = wsl --status 2>&1
    if ($LASTEXITCODE -ne 0 -or $wslStatus -match "not installed|не установлен") {
        Write-Host "WSL2 не установлен. Устанавливаю..." -ForegroundColor Yellow
        wsl --install
        Write-Host ""
        Write-Host "⚠️  ВАЖНО: После установки WSL2 требуется ПЕРЕЗАГРУЗКА!" -ForegroundColor Red
        Write-Host "Перезагрузите компьютер и запустите этот скрипт снова." -ForegroundColor Yellow
        Write-Host ""
        $restart = Read-Host "Перезагрузить сейчас? (Y/N)"
        if ($restart -eq "Y" -or $restart -eq "y") {
            Restart-Computer -Force
        }
        exit 0
    } else {
        Write-Host "✓ WSL2 уже установлен" -ForegroundColor Green
    }
} catch {
    Write-Host "Ошибка при проверке WSL: $_" -ForegroundColor Red
    exit 1
}

# 2) Проверка, не установлен ли уже Docker
Write-Host "[2/4] Проверка Docker..." -ForegroundColor Yellow
if (Get-Command docker -ErrorAction SilentlyContinue) {
    $dockerVersion = docker --version
    Write-Host "✓ Docker уже установлен: $dockerVersion" -ForegroundColor Green
    
    # Проверка, работает ли Docker daemon
    try {
        docker version | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Docker daemon работает" -ForegroundColor Green
            Write-Host ""
            Write-Host "Docker готов к использованию!" -ForegroundColor Green
            exit 0
        }
    } catch {
        Write-Host "Docker установлен, но daemon не запущен. Запускаю Docker Desktop..." -ForegroundColor Yellow
    }
}

# 3) Скачивание Docker Desktop
Write-Host "[3/4] Скачивание Docker Desktop..." -ForegroundColor Yellow
$dockerUrl = "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"
$installerPath = "$env:TEMP\DockerDesktopInstaller.exe"

try {
    if (Test-Path $installerPath) {
        Write-Host "Установщик уже скачан" -ForegroundColor Gray
    } else {
        Write-Host "Скачиваю установщик (это может занять несколько минут)..." -ForegroundColor Gray
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $dockerUrl -OutFile $installerPath -UseBasicParsing
        Write-Host "✓ Установщик скачан" -ForegroundColor Green
    }
} catch {
    Write-Host "Ошибка при скачивании: $_" -ForegroundColor Red
    Write-Host "Попробуйте скачать вручную: $dockerUrl" -ForegroundColor Yellow
    exit 1
}

# 4) Установка Docker Desktop
Write-Host "[4/4] Установка Docker Desktop..." -ForegroundColor Yellow
Write-Host "Запускаю установщик (может потребоваться подтверждение в UAC)..." -ForegroundColor Gray

try {
    Start-Process -FilePath $installerPath -ArgumentList "install", "--quiet", "--accept-license" -Wait -NoNewWindow
    Write-Host "✓ Установка завершена" -ForegroundColor Green
} catch {
    Write-Host "Ошибка при установке: $_" -ForegroundColor Red
    Write-Host "Попробуйте запустить установщик вручную: $installerPath" -ForegroundColor Yellow
    exit 1
}

# 5) Запуск Docker Desktop
Write-Host ""
Write-Host "Запускаю Docker Desktop..." -ForegroundColor Yellow
$dockerDesktopPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
if (Test-Path $dockerDesktopPath) {
    Start-Process $dockerDesktopPath
    Write-Host "✓ Docker Desktop запущен" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ожидаю инициализацию Docker (это может занять 1-2 минуты)..." -ForegroundColor Yellow
    
    # Ожидание готовности Docker
    $maxAttempts = 24
    $attempt = 0
    $dockerReady = $false
    
    while ($attempt -lt $maxAttempts) {
        $attempt++
        Start-Sleep -Seconds 5
        try {
            $result = docker version 2>&1
            if ($LASTEXITCODE -eq 0) {
                $dockerReady = $true
                break
            }
        } catch {
            # Продолжаем ожидание
        }
        Write-Host "  Попытка $attempt/$maxAttempts..." -ForegroundColor Gray
    }
    
    if ($dockerReady) {
        Write-Host ""
        Write-Host "✓✓✓ Docker готов к использованию! ✓✓✓" -ForegroundColor Green
        Write-Host ""
        docker version
        Write-Host ""
        Write-Host "Теперь можно запускать docker compose!" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "⚠️  Docker Desktop запущен, но daemon еще не готов." -ForegroundColor Yellow
        Write-Host "Подождите 1-2 минуты и проверьте: docker version" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Docker Desktop не найден в стандартном месте." -ForegroundColor Yellow
    Write-Host "Проверьте, что установка завершилась успешно." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Установка завершена ===" -ForegroundColor Cyan
