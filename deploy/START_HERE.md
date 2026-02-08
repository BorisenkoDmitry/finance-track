# 🚀 Быстрый запуск локальной среды

## Автоматический запуск (рекомендуется)

### Вариант 1: BAT файл (самый простой)
1. Откройте папку `deploy` в проводнике Windows
2. Дважды кликните на `start-local.bat`
3. Дождитесь завершения (может занять 5-10 минут при первом запуске)

### Вариант 2: PowerShell скрипт
1. Откройте PowerShell в папке `deploy`
2. Выполните: `.\start-local.ps1`

### Вариант 3: Node.js скрипт
1. Откройте терминал в папке `deploy`
2. Выполните: `node run-docker.js`

## Ручной запуск

Если автоматические скрипты не работают, выполните команды вручную:

### 1. Перейдите в папку deploy
```powershell
cd "F:\Для работы\save-easily\deploy"
```

### 2. Создайте .env файл (если его нет)
```powershell
copy env.example .env
```

### 3. Отредактируйте .env
Откройте `.env` в текстовом редакторе и замените:
- `JWT_SECRET=CHANGE_ME_LONG_RANDOM_SECRET` → `JWT_SECRET=<любая_длинная_случайная_строка>`
- `POSTGRES_PASSWORD=CHANGE_ME_DB_PASSWORD` → `POSTGRES_PASSWORD=<любой_пароль>`
- `SEED_ADMIN_PASSWORD=CHANGE_ME_STRONG_PASSWORD` → `SEED_ADMIN_PASSWORD=<любой_пароль>`

### 4. Запустите Docker Compose
```powershell
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
```

### 5. Проверьте статус
```powershell
docker compose ps
```

Все три контейнера (`db`, `backend`, `web`) должны быть в статусе `Up`.

## Доступ к приложению

После успешного запуска:

- **Frontend**: http://localhost:8080/
- **Backend API**: http://localhost:3000/
- **PostgreSQL**: localhost:5432

## Просмотр логов

```powershell
# Логи backend
docker compose logs -f backend

# Логи web (Nginx)
docker compose logs -f web

# Логи базы данных
docker compose logs -f db
```

## Остановка

```powershell
docker compose -f docker-compose.yml -f docker-compose.local.yml down
```

## Решение проблем

### Docker Desktop не запущен
Убедитесь, что Docker Desktop запущен и полностью инициализирован (иконка в трее должна быть зеленая).

### Порт занят
Если порты 8080, 3000 или 5432 заняты, измените их в `docker-compose.local.yml`:
```yaml
web:
  ports:
    - "8081:80"  # вместо 8080
```

### Ошибки при сборке
Проверьте логи:
```powershell
docker compose logs backend
```

### База данных не подключается
Убедитесь, что в `.env` указаны правильные значения для PostgreSQL и они совпадают в секциях `db` и `backend`.

## Первый запуск

При первом запуске:
1. Docker скачает образы (PostgreSQL, Node.js, Nginx) - это может занять время
2. Backend соберет приложение
3. Frontend соберет приложение
4. База данных инициализируется
5. Создастся администратор (если `SEED_ON_STARTUP=true`)

**Время первого запуска: 5-10 минут**
