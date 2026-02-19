# API

Базовый URL: `http://localhost:3000/api`

## Аутентификация

Защищённые эндпоинты требуют заголовок:

```
Authorization: Bearer <токен>
```

---

## Эндпоинты

### POST `/auth/register`

Регистрация нового пользователя.

**Тело запроса:**

```json
{
  "email": "user@example.com",
  "password": "secret",
  "displayName": "Иван"
}
```

`displayName` — опциональное поле.

**Ответ `200`:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "displayName": "Иван",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### POST `/auth/login`

Вход. Возвращает JWT-токен.

**Тело запроса:**

```json
{
  "email": "user@example.com",
  "password": "secret"
}
```

**Ответ `200`:**

```json
{
  "accessToken": "eyJ..."
}
```

---

### GET `/auth/me`

Получить данные текущего пользователя. Требует токен.

**Ответ `200`:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "displayName": "Иван",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### GET `/health`

Проверка что сервер живой.

**Ответ `200`:**

```json
{ "status": "ok" }
```
