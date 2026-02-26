# @rs-tandem/backend

REST API на NestJS. Работает на `http://localhost:3000`, все эндпоинты под `/api`.

**Production:** https://rs-tandem-production.up.railway.app

## Необходимо

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Быстрый старт

### 1. Поднять базу данных

Нужен Docker. Из папки `packages/backend`:

```bash
docker compose up -d
```

Это запустит PostgreSQL на порту `5432`.

### 2. Настроить переменные окружения

```bash
cp .env.example .env
```

Открыть `.env` и поменять одно — сгенерировать секрет для JWT:

```bash
openssl rand -hex 32
```

Вставить результат в `JWT_SECRET`. Остальные значения уже настроены для локальной разработки.

### 3. Применить миграции

```bash
npm run migrate:up -w @rs-tandem/backend
```

Это создаст таблицы в базе. Нужно делать один раз при первом запуске, и повторять каждый раз когда появляются новые миграции (обычно после `git pull`).

### 4. Запустить сервер

Из корня репозитория:

```bash
npm run start:backend
```

Сервер поднимется на `http://localhost:3000`.

---

## Что такое миграции

Миграции — это SQL-файлы, которые описывают структуру базы данных: какие таблицы есть, какие у них колонки. Хранятся в `src/migrations/`.

Когда добавляется новая фича, которой нужна новая таблица или колонка — создаётся новый файл миграции. `migrate:up` применяет все файлы, которые ещё не были применены. `migrate:down` откатывает последний.

Создать новую миграцию:

```bash
npm run migrate:create -w @rs-tandem/backend -- --name add_something
```

---

## Тесты

```bash
npm test -w @rs-tandem/backend
```

Документация по эндпоинтам: [API.md](./API.md).
