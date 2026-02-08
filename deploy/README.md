## Deploy via SSH (www.finance-track.ru)

Этот репозиторий подготовлен для деплоя через Docker Compose:
- **Postgres** (данные в volume `pgdata`)
- **Backend (NestJS)** на `:3000`
- **Web (Nginx)** на `:80`, отдаёт фронт и проксирует `/api/*` в backend

### Цель: одинаковая среда локально и на сервере
Мы используем **один и тот же** `deploy/docker-compose.yml` и **один и тот же набор переменных** в `deploy/.env`.
Разница только в значениях (домен/секреты/пароли), но структура переменных и команда запуска одинаковые.

### 0) Важно про безопасность
- Не храните логин/пароль SSH в репозитории.
- После первого входа лучше перейти на **SSH key** и сменить пароль.

### 1) DNS
Убедитесь, что:
- `finance-track.ru` → A запись на IP сервера
- `www.finance-track.ru` → A/CNAME на тот же IP

### 2) Установка Docker на сервере
На Ubuntu (пример):

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

### 3) Заливка кода на сервер
Самый простой путь:

```bash
mkdir -p ~/apps/finance-track
cd ~/apps/finance-track
# загрузите сюда репозиторий (git clone / scp / rsync)
```

### 4) Env для продакшена
Создайте файл `deploy/.env` на сервере:

```bash
cp deploy/env.example deploy/.env
nano deploy/.env
```

Обязательно поменяйте:
- `JWT_SECRET`
- `POSTGRES_PASSWORD`
- `SEED_ADMIN_PASSWORD`

### 5) Запуск

```bash
cd deploy
docker compose up -d --build
docker compose ps
```

Проверка:
- `curl -I http://localhost/` (должен отдать фронт)
- `curl -I http://localhost/api/auth/me` (должен отвечать 401/200)

### Локальный запуск (тот же самый Compose)
Вариант 1 (как на сервере, порт 80):

```bash
cd deploy
cp env.example .env
# отредактируйте .env при необходимости
docker compose up -d --build
```

Откройте: `http://localhost/`

Вариант 2 (локальные порты для отладки, web на 8080 + доступ к db/backend):

```bash
cd deploy
cp env.example .env
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build
```

Откройте: `http://localhost:8080/`

> Windows: см. `deploy/LOCAL_SETUP_WINDOWS.md` (WSL2 + Docker Desktop + запуск).

### 6) HTTPS (рекомендуется)
Самый простой вариант — поставить Nginx на хосте + certbot, а контейнерный nginx слушать только 127.0.0.1.
Если хотите — я добавлю конфиг под HTTPS прямо в контейнер (с volume для сертификатов).

### 7) Вход в приложение
Админ создаётся автоматически при старте (если пользователя ещё нет):
- email: `SEED_ADMIN_EMAIL`
- пароль: `SEED_ADMIN_PASSWORD`

Каталоги (статические) создаются для этого пользователя автоматически.

