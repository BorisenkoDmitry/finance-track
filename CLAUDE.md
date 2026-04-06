# Finance Track (save-easily)

## Project Overview
Personal finance tracking app: NestJS backend + React/Vite frontend + PostgreSQL.
Monorepo: `backend/`, `frontend/`, `compose.yaml`, `deploy/`.

## Architecture
- **Backend**: NestJS 11, TypeORM, PostgreSQL, JWT auth. Port 3000 (dev).
- **Frontend**: React 18, Vite, Redux Toolkit, Axios. Port 5173 (dev).
- **DB**: PostgreSQL, database name `financeControl`.
- **Deploy**: Docker Compose on server, nginx reverse proxy, systemd service.

## Git
- Repo: `git@github.com:BorisenkoDmitry/finance-track.git`
- Branch: `main`
- Single monorepo (not submodules)

## Local Development (without Docker)
- Backend: `cd backend && npm run start:dev` (loads `.env.development`)
- Frontend: `cd frontend && npm run dev`
- PostgreSQL runs locally (installed, port 5432)

## Server Deploy
- SSH: `ssh Borisenko_SERVER` (168.222.192.244, root)
- Path: `/srv/apps/finance-track/`
- Deploy: `git pull && docker compose up -d --build`
- Server git remote uses alias `github-finance`
- Domain: `finance-track.ru`
- Containers: finance-track-db, finance-track-backend, finance-track-frontend, finance-track-pgadmin

## Environment Files
- `backend/.env.development` — local dev config (in git? no, only this one is tracked)
- `backend/.env.production` — server config (in .gitignore)
- `postgres.env` — DB creds for Docker (in .gitignore)
- `.env` — root env (in .gitignore)

## Key Config
- TypeORM config: `backend/src/config/typeorm.config.ts`
- App module: `backend/src/app.module.ts`
- envFilePath loads: `.env.{NODE_ENV}`, `.env`, `.env.development`
