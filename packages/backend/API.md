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

### PATCH `/auth/change-password`

Сменить пароль текущего пользователя. Требует токен.

**Тело запроса:**

```json
{
  "currentPassword": "старый_пароль",
  "newPassword": "новый_пароль"
}
```

Оба поля обязательные. Пароль должен быть минимум 8 символов.

**Ответ `204`:** — пароль успешно изменён. Пустое тело ответа.

**Ответ `400`:** — пароль меньше 8 символов.

```json
{
  "message": ["currentPassword must be longer than or equal to 8 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```

**Ответ `401`:** — текущий пароль неверный.

```json
{ "message": "Current password is incorrect", "error": "Unauthorized", "statusCode": 401 }
```

**Ответ `409`:** — новый пароль совпадает с текущим.

```json
{
  "message": "New password must differ from the current password",
  "error": "Conflict",
  "statusCode": 409
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

### GET `/quiz/categories`

Получить список категорий викторины с прогрессом пользователя. Требует токен. Поддерживает заголовок `Accept-Language` (`en` или `ru`).

**Ответ `200`:**

```json
{
  "categories": [
    {
      "id": "uuid",
      "name": "JavaScript Basics",
      "description": "Fundamental JS concepts",
      "topicsCount": 5,
      "topicsCompleteCount": 2,
      "progress": 0.4
    }
  ]
}
```

---

### GET `/quiz/categories/:id`

Получить категорию с её топиками. Требует токен. Поддерживает заголовок `Accept-Language`.

**Ответ `200`:**

```json
{
  "id": "uuid",
  "name": "JavaScript Basics",
  "description": "Fundamental JS concepts",
  "topics": [
    {
      "id": "uuid",
      "name": "Variables",
      "description": "let, const, var",
      "questionsCount": 10,
      "score": 85,
      "inProgress": false
    }
  ],
  "topicsCount": 5,
  "topicsCompleteCount": 2,
  "progress": 0.4
}
```

**Ответ `400`:** — `:id` не является валидным UUID.

**Ответ `404`:** — категория не найдена.

---

### GET `/quiz/topics/:id`

Получить топик со всеми вопросами (для отображения в UI). Требует токен. Поддерживает заголовок `Accept-Language`.

**Ответ `200`:**

```json
{
  "id": "uuid",
  "name": "Variables",
  "description": "let, const, var",
  "category": "JavaScript Basics",
  "questions": [
    {
      "id": "uuid",
      "name": "What is the difference between let and var?",
      "codeSnippet": "let x = 1; var y = 2;",
      "answers": [
        { "id": "uuid1", "text": "Scope" },
        { "id": "uuid2", "text": "Hoisting" }
      ]
    }
  ],
  "questionsCount": 1,
  "step": 0
}
```

**Ответ `400`:** — `:id` не является валидным UUID.

**Ответ `404`:** — топик не найден.

---

### POST `/quiz/topics/:id/start`

Начать прохождение топика. Создаёт новую попытку или возвращает текущую незавершённую. Требует токен.

**Ответ `201`:**

```json
{
  "step": 0
}
```

**Ответ `400`:** — `:id` не является валидным UUID.

**Ответ `404`:** — топик не найден.

---

### PUT `/quiz/topics/:topicId/questions/:questionId`

Отправить ответ на вопрос и перейти к следующему шагу. Требует токен. Поддерживает заголовок `Accept-Language` (для получения объяснения на нужном языке).

**Тело запроса:**

```json
{
  "answerId": "uuid",
  "isTimeUp": false
}
```

**Ответ `200`:**

```json
{
  "isCorrect": true,
  "explanation": "Detailed explanation of the answer..."
}
```

**Ответ `400`:** — `:topicId` или `:questionId` не является валидным UUID, либо нет активной сессии.

---

### GET `/quiz/results/:topicId`

Получить результаты последней завершённой попытки по топику. Требует токен.

**Ответ `200`:**

```json
{
  "results": {
    "score": 85,
    "links": ["https://developer.mozilla.org/..."]
  }
}
```

**Ответ `400`:** — `:topicId` не является валидным UUID.

**Ответ `404`:** — нет завершённых попыток по данному топику.

---

### GET `/health`

Проверка что сервер живой.

**Ответ `200`:**

```json
{ "status": "ok" }
```

### GET `/chat-history/history`

Получить историю сообщений. Требует токен.

**Ответ `200`:**

```json
[
  {
    "role": "user",
    "content": "Hi"
  },
  {
    "role": "assistant",
    "content": "Hi there! How’s your day going so far? 😊 \n\nIs the…at about, or anything I can help you with today?\n"
  }
]
```

**Ответ `500`:** - внутренняя ошибка сервра

### DELETE `/chat-history/history`

Удалить историю сообщений. Требует токен.

**Ответ `200`:**

```json
null
```

**Ответ `500`:** - внутренняя ошибка сервра
