# Инструкция по сборке и запуску

## ✅ Проверка кода

Код проверен линтером - ошибок не найдено.

## 🔨 Локальная сборка (опционально, для проверки)

### Frontend
```cmd
cd frontend
npm install
npm run build
```

### Backend  
```cmd
cd backend
npm install
npm run build
```

## 🐳 Запуск Docker

### Автоматический запуск с проверкой логов

Запустите файл:
```
deploy\run-docker-check.bat
```

Этот скрипт:
1. Остановит существующие контейнеры
2. Соберет и запустит все сервисы
3. Покажет логи при ошибках
4. Выведет статус контейнеров

### Или используйте стандартный скрипт

```
deploy\start-local.bat
```

## 📋 Проверка после запуска

### 1. Проверьте статус контейнеров
```cmd
cd deploy
docker compose ps
```

Все три контейнера (`db`, `backend`, `web`) должны быть в статусе `Up`.

### 2. Проверьте логи при проблемах

**Логи фронтенда (web):**
```cmd
docker compose logs web --tail 100
```

**Логи бэкенда:**
```cmd
docker compose logs backend --tail 100
```

**Логи базы данных:**
```cmd
docker compose logs db --tail 50
```

### 3. Проверьте доступность сервисов

- **Frontend**: http://localhost:8080/
- **Backend API**: http://localhost:3000/

## 🔍 Типичные проблемы и решения

### Проблема: Ошибка сборки фронтенда

**Симптомы:** `npm run build` завершается с кодом 2

**Решение:**
1. Проверьте логи: `docker compose logs web`
2. Попробуйте собрать локально: `cd frontend && npm run build`
3. Если локальная сборка не работает, исправьте ошибки TypeScript
4. Пересоберите без кэша: `docker compose build --no-cache web`

### Проблема: Backend не подключается к базе данных

**Симптомы:** Ошибки подключения к PostgreSQL в логах backend

**Решение:**
1. Убедитесь, что контейнер `db` запущен: `docker compose ps`
2. Проверьте переменные окружения в `.env`:
   - `POSTGRES_DB`
   - `POSTGRES_USER`
   - `POSTGRES_PASSWORD`
3. Эти же значения должны быть в секции `backend` в `docker-compose.yml`

### Проблема: CORS ошибки

**Симптомы:** Ошибки CORS в браузере при запросах к API

**Решение:**
1. Проверьте `CORS_ORIGINS` в `.env` - должен включать `http://localhost:8080`
2. Перезапустите backend: `docker compose restart backend`

### Проблема: Порт занят

**Симптомы:** Ошибка при запуске контейнеров о занятом порте

**Решение:**
1. Измените порты в `docker-compose.local.yml`:
   ```yaml
   web:
     ports:
       - "8081:80"  # вместо 8080
   ```
2. Или остановите процесс, занимающий порт

## 🛠️ Полезные команды

### Полная пересборка
```cmd
cd deploy
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Просмотр логов в реальном времени
```cmd
docker compose logs -f backend
docker compose logs -f web
```

### Остановка всех контейнеров
```cmd
cd deploy
docker compose -f docker-compose.yml -f docker-compose.local.yml down
```

### Очистка всех данных (включая базу)
```cmd
cd deploy
docker compose down -v
```

## 📝 Примечания

- При первом запуске Docker скачает образы и соберет приложения - это может занять 5-10 минут
- База данных инициализируется автоматически при первом запуске
- Администратор создается автоматически, если `SEED_ON_STARTUP=true` в `.env`
