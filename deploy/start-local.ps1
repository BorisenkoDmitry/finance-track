# Local Docker Compose startup script
$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "=== Finance Track - Local Development Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    $null = docker version 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Docker not running"
    }
    Write-Host "Docker is ready!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker Desktop is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and wait for it to initialize." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Create .env if missing
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env from env.example..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env" -Force
    
    # Update CORS_ORIGINS to include localhost:8080
    $envContent = Get-Content ".env" -Raw
    $envContent = $envContent -replace 'CORS_ORIGINS=.*', 'CORS_ORIGINS=http://localhost:8080,http://localhost:5173,http://127.0.0.1:5173,http://localhost,https://www.finance-track.ru,https://finance-track.ru'
    
    # Generate random JWT_SECRET if still default
    if ($envContent -match 'JWT_SECRET=CHANGE_ME') {
        $randomSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})
        $envContent = $envContent -replace 'JWT_SECRET=CHANGE_ME.*', "JWT_SECRET=$randomSecret"
    }
    
    # Generate random passwords if still default
    if ($envContent -match 'POSTGRES_PASSWORD=CHANGE_ME') {
        $dbPassword = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
        $envContent = $envContent -replace 'POSTGRES_PASSWORD=CHANGE_ME.*', "POSTGRES_PASSWORD=$dbPassword"
    }
    
    if ($envContent -match 'SEED_ADMIN_PASSWORD=CHANGE_ME') {
        $adminPassword = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 24 | ForEach-Object {[char]$_})
        $envContent = $envContent -replace 'SEED_ADMIN_PASSWORD=CHANGE_ME.*', "SEED_ADMIN_PASSWORD=$adminPassword"
    }
    
    Set-Content ".env" -Value $envContent -NoNewline
    Write-Host ".env created with generated secrets!" -ForegroundColor Green
} else {
    Write-Host ".env already exists, skipping creation." -ForegroundColor Gray
}

Write-Host ""

# Stop existing containers
Write-Host "Stopping existing containers (if any)..." -ForegroundColor Yellow
docker compose -f docker-compose.yml -f docker-compose.local.yml down 2>&1 | Out-Null

Write-Host ""

# Build and start
Write-Host "Building and starting containers..." -ForegroundColor Cyan
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to start containers!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "=== Container Status ===" -ForegroundColor Cyan
docker compose ps

Write-Host ""
Write-Host "=== Local Development Environment Ready! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend (Nginx):  http://localhost:8080/" -ForegroundColor White
Write-Host "Backend API:       http://localhost:3000/" -ForegroundColor White
Write-Host "PostgreSQL:        localhost:5432" -ForegroundColor White
Write-Host ""
Write-Host "To view logs:" -ForegroundColor Yellow
Write-Host "  docker compose logs -f backend" -ForegroundColor Gray
Write-Host "  docker compose logs -f web" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop:" -ForegroundColor Yellow
Write-Host "  docker compose -f docker-compose.yml -f docker-compose.local.yml down" -ForegroundColor Gray
Write-Host ""
