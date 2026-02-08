Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Push-Location $PSScriptRoot
try {
  # Check if Docker is installed
  if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Docker is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "To install Docker Desktop:" -ForegroundColor Yellow
    Write-Host "1. Open PowerShell as Administrator" -ForegroundColor Yellow
    Write-Host "2. Run: .\install-docker-windows.ps1" -ForegroundColor Yellow
    Write-Host "   OR follow instructions in: LOCAL_SETUP_WINDOWS.md" -ForegroundColor Yellow
    Write-Host ""
    exit 1
  }

  # Check if Docker daemon is running
  try {
    docker version | Out-Null
    if ($LASTEXITCODE -ne 0) {
      Write-Host "ERROR: Docker is installed but daemon is not running!" -ForegroundColor Red
      Write-Host "Please start Docker Desktop and wait for it to initialize." -ForegroundColor Yellow
      exit 1
    }
  } catch {
    Write-Host "ERROR: Docker daemon is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and wait for it to initialize." -ForegroundColor Yellow
    exit 1
  }

  Write-Host "Docker is ready!" -ForegroundColor Green
  Write-Host ""

  if (-not (Test-Path ".env")) {
    Copy-Item "env.example" ".env" -Force
    Write-Host "Created deploy/.env from env.example. Edit deploy/.env if needed." -ForegroundColor Yellow
    Write-Host ""
  }

  Write-Host "Starting docker compose (local debug mode)..." -ForegroundColor Cyan
  docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
  
  Write-Host ""
  Write-Host "Checking container status..." -ForegroundColor Cyan
  docker compose ps
  
  Write-Host ""
  Write-Host "=== Local debug environment is ready! ===" -ForegroundColor Green
  Write-Host "Open: http://localhost:8080/" -ForegroundColor Green
  Write-Host ""
  Write-Host "To view logs:" -ForegroundColor Yellow
  Write-Host "  docker compose logs -f backend" -ForegroundColor Gray
  Write-Host "  docker compose logs -f web" -ForegroundColor Gray
  Write-Host ""
}
finally {
  Pop-Location
}

