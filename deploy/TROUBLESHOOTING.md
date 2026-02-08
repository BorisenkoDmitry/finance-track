# Решение проблем при сборке

## Ошибка сборки фронтенда

Если при сборке возникает ошибка `npm run build` с кодом выхода 2:

### 1. Проверьте логи сборки

```powershell
docker compose logs web
```

Или для более детального вывода:

```powershell
docker compose -f docker-compose.yml -f docker-compose.local.yml build web --no-cache --progress=plain
```

### 2. Проверьте локальную сборку

Перед сборкой в Docker попробуйте собрать фронтенд локально:

```powershell
cd frontend
npm install
npm run build
```

Если локальная сборка не работает, исправьте ошибки TypeScript/ESLint.

### 3. Типичные проблемы

#### Проблема: Ошибки TypeScript
**Решение**: Проверьте `tsconfig.json` и исправьте ошибки типов:
```powershell
cd frontend
npx tsc --noEmit
```

#### Проблема: Отсутствуют зависимости
**Решение**: Убедитесь, что `package-lock.json` существует и актуален:
```powershell
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### Проблема: Проблемы с путями в Docker
**Решение**: Убедитесь, что структура файлов правильная. Dockerfile ожидает:
```
project-root/
  frontend/
    package.json
    src/
    ...
  deploy/
    web.Dockerfile
    docker-compose.yml
```

### 4. Пересборка с очисткой кэша

Если проблема не решается, попробуйте полную пересборку:

```powershell
docker compose -f docker-compose.yml -f docker-compose.local.yml down
docker compose -f docker-compose.yml -f docker-compose.local.yml build --no-cache web
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d
```

### 5. Проверка конфигурации

Убедитесь, что в `frontend/vite.config.ts` нет проблем с путями или плагинами.

### 6. Просмотр детальных логов

Для просмотра всех логов сборки:

```powershell
docker compose -f docker-compose.yml -f docker-compose.local.yml build web --progress=plain 2>&1 | tee build.log
```

Затем откройте `build.log` для анализа ошибок.

## Ошибка подключения к базе данных

Если backend не может подключиться к PostgreSQL:

1. Проверьте, что контейнер `db` запущен:
   ```powershell
   docker compose ps
   ```

2. Проверьте логи базы данных:
   ```powershell
   docker compose logs db
   ```

3. Убедитесь, что в `.env` правильные значения для PostgreSQL

## Ошибка CORS

Если возникают ошибки CORS:

1. Проверьте `CORS_ORIGINS` в `.env`
2. Убедитесь, что включен `http://localhost:8080`
3. Перезапустите backend:
   ```powershell
   docker compose restart backend
   ```
