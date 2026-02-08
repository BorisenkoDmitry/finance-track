# Быстрый запуск локальной среды разработки

## Шаг 1: Убедитесь, что Docker Desktop запущен

Откройте Docker Desktop и дождитесь, пока он полностью запустится (иконка в трее должна быть зеленая).

## Шаг 2: Создайте файл .env (если его нет)

В папке `deploy/` должен быть файл `.env`. Если его нет, скопируйте `env.example` в `.env`:

```powershell
cd deploy
copy env.example .env
```

## Шаг 3: Запустите Docker Compose

Откройте PowerShell или CMD в папке `deploy/` и выполните:

```powershell
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
```

Или используйте готовый скрипт:
- **PowerShell**: `.\up-local.ps1`
- **CMD/BAT**: `up-local.bat`

## Шаг 4: Проверьте статус контейнеров

```powershell
docker compose ps
```

Все три контейнера (`db`, `backend`, `web`) должны быть в статусе `Up`.

## Шаг 5: Проверьте логи (если нужно)

```powershell
# Логи backend
docker compose logs -f backend

# Логи web (Nginx)
docker compose logs -f web

# Логи базы данных
docker compose logs -f db
```

## Шаг 6: Откройте приложение

- **Frontend (через Nginx)**: http://localhost:8080/
- **Backend API (напрямую)**: http://localhost:3000/

## Шаг 7: Проверьте работу API

Откройте браузер или используйте curl:

```powershell
# Проверка health endpoint (если есть)
curl http://localhost:3000/

# Проверка через Nginx proxy
curl http://localhost:8080/api/
```

## Важные порты

- **8080** - Frontend (Nginx) - основной порт для работы с приложением
- **3000** - Backend API - для прямых запросов к API
- **5432** - PostgreSQL - для подключения к базе данных (если нужно)

## Остановка контейнеров

```powershell
docker compose down
```

Или используйте скрипт:
- **PowerShell**: `.\down.ps1`

## Решение проблем

### Порт 8080 или 3000 уже занят

Измените порты в `docker-compose.local.yml`:

```yaml
web:
  ports:
    - "8081:80"  # вместо 8080

backend:
  ports:
    - "3001:3000"  # вместо 3000
```

### Backend не запускается

Проверьте логи:
```powershell
docker compose logs backend
```

Убедитесь, что:
1. База данных запущена и доступна
2. В `.env` указаны правильные переменные окружения
3. `JWT_SECRET` и `SEED_ADMIN_PASSWORD` установлены (не `CHANGE_ME_...`)

### Frontend показывает 404 для API запросов

Проверьте конфигурацию Nginx в `deploy/nginx/site.conf`. Убедитесь, что:
- `proxy_pass http://backend_upstream/;` настроен правильно
- Backend контейнер запущен и доступен

### База данных не подключается

Проверьте переменные в `.env`:
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

Убедитесь, что они совпадают в секциях `db` и `backend` в `docker-compose.yml`.
