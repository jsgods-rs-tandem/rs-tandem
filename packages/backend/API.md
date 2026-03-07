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

### GET `/profiles/me`

Получить профиль текущего пользователя. Требует токен.

**Ответ `200`:**

```json
{
  "userId": "uuid",
  "displayName": "Иван",
  "email": "user@example.com",
  "totalXp": 0,
  "level": 1,
  "problemsSolved": 0,
  "currentStreak": 0,
  "longestStreak": 0,
  "lastSolvedAt": null
}
```

---

### PATCH `/profiles/me`

Обновить профиль текущего пользователя. Требует токен.

**Тело запроса:**

```json
{
  "displayName": "Новое имя",
  "email": "new@example.com"
}
```

Оба поля опциональные. Можно отправить одно или оба.

**Ответ `200`:** — обновлённый профиль (формат как у `GET /profiles/me`).

**Ответ `409`:** — если `email` уже занят другим пользователем.

---

### GET `/profiles/:id`

Получить публичный профиль пользователя по ID. Токен не требуется.

**Ответ `200`:**

```json
{
  "userId": "uuid",
  "displayName": "Иван",
  "totalXp": 0,
  "level": 1,
  "problemsSolved": 0,
  "currentStreak": 0
}
```

---

### GET `/ai/providers`

Список доступных AI-провайдеров. Токен не требуется.

**Ответ `200`:**

```json
[{ "id": "ollama", "label": "Ollama (local)", "requiresKey": false }]
```

---

### GET `/ai/settings/me`

Получить выбранного AI-провайдера текущего пользователя. Требует токен.

**Ответ `200`:**

```json
{
  "providerId": "ollama",
  "hasKey": false
}
```

**Ответ `400`:** — если настройки ещё не выбраны.

---

### PUT `/ai/settings/me`

Выбрать AI-провайдера. Требует токен.

**Тело запроса:**

```json
{
  "providerId": "ollama"
}
```

`providerId` — обязательное поле; должно совпадать с одним из ID из `GET /ai/providers`.

**Ответ `200`:** — обновлённые настройки (формат как у `GET /ai/settings/me`).

**Ответ `400`:** — если `providerId` неизвестен.

---

### POST `/ai/chat`

Отправить сообщение AI. Требует токен. Rate-limited (по `userId`).

**Тело запроса:**

```json
{
  "messages": [{ "role": "user", "content": "Привет!" }]
}
```

`messages` — обязательный массив (минимум 1 элемент). `role`: `"user"`, `"assistant"` или `"system"`.

**Ответ `200`:**

```json
{
  "content": "Привет! Чем могу помочь?"
}
```

**Ответ `400`:** — если не выбран провайдер или провайдер требует API-ключ, а он не задан.

**Ответ `502`:** — если провайдер недоступен (например, Ollama не запущен).

---

### GET `/health`

Проверка что сервер живой.

**Ответ `200`:**

```json
{ "status": "ok" }
```
