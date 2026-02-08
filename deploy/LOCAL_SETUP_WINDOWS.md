# Локальная установка Docker (Windows 10/11) + запуск проекта через Docker Compose

Цель: чтобы **локально** и **на сервере** запуск был одинаковый: `deploy/.env` + `docker compose up`.

## 0) Предусловия
- В BIOS/UEFI должна быть включена виртуализация (Intel VT-x / AMD-V).
- Нужны права администратора (для включения компонентов Windows и установки Docker Desktop).

## 1) Установка/включение WSL2
Открой PowerShell **от имени администратора** и выполни:

```powershell
wsl.exe --install
```

Затем перезагрузи ПК.

После перезагрузки проверь:

```powershell
wsl.exe --status
wsl.exe --set-default-version 2
```

Если нет дистрибутива Linux — установи Ubuntu:

```powershell
wsl.exe --install -d Ubuntu
```

## 2) Установка Docker Desktop
Вариант A (рекомендуется): скачать и установить Docker Desktop вручную:
- Docker Desktop Installer: `https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe`

После установки:
- включи **Use WSL 2 based engine**
- убедись, что Docker Desktop запущен (иконка в трее)

Проверка в PowerShell:

```powershell
docker version
docker compose version
```

## 3) Запуск проекта локально (Compose)
Перейди в папку `deploy`, создай `.env` и подними контейнеры.

### Вариант 1: как на сервере (web на 80)

```powershell
cd deploy
copy env.example .env
docker compose up -d --build
docker compose ps
```

Открыть: `http://localhost/`

### Вариант 2: локальная отладка (web на 8080 + проброс db/backend)

```powershell
cd deploy
copy env.example .env
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
docker compose ps
```

Открыть: `http://localhost:8080/`

## 4) Быстрая диагностика (если "не работает")
Логи:

```powershell
cd deploy
docker compose logs -f backend
docker compose logs -f web
docker compose logs -f db
```

Проверки:
- `http://localhost:8080/api/` должен проксироваться в backend (обычно вернёт ответ с `/` контроллера)
- `http://localhost:8080/api/auth/me` обычно 401/200 (в зависимости от авторизации), но **не 404**

Если backend не стартует и пишет про БД:
- проверь, что контейнер `db` healthy: `docker compose ps`
- проверь переменные в `deploy/.env` (пароль/имя базы)

