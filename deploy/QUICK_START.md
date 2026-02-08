# Быстрый старт: Docker локально

## Если Docker НЕ установлен

**Открой PowerShell от имени администратора** и выполни:

```powershell
cd "F:\Для работы\save-easily\deploy"
.\install-docker-windows.ps1
```

Скрипт:
1. Установит WSL2 (потребуется перезагрузка)
2. Скачает и установит Docker Desktop
3. Запустит Docker Desktop

**После перезагрузки** (если была установка WSL2) запусти скрипт снова.

## Если Docker УЖЕ установлен

Просто запусти локальную отладку:

```powershell
cd "F:\Для работы\save-easily\deploy"
.\up-local.ps1
```

Откроется на: **http://localhost:8080/**

## Проверка

```powershell
# Проверить статус контейнеров
docker compose ps

# Посмотреть логи
docker compose logs -f backend
docker compose logs -f web

# Остановить всё
.\down.ps1
```

## Если что-то не работает

1. Убедись, что Docker Desktop запущен (иконка в трее)
2. Проверь логи: `docker compose logs -f backend`
3. Проверь, что порт 8080 свободен: `netstat -ano | findstr :8080`
