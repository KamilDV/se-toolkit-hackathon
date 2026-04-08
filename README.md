# AI Flashcards 🧠

AI-Flashcards — это веб-приложение для автоматического создания учебных карточек из любого текста с использованием AI (Qwen).

## Демо
![Demo Placeholder](https://via.placeholder.com/800x450?text=AI+Flashcards+Interface+Demo)

## Контекст продукта
- **Целевая аудитория:** Студенты и все, кто занимается самообразованием.
- **Проблема:** Ручное создание флешкарточек из длинных лекций занимает много времени.
- **Решение:** Мгновенная генерация качественных пар вопрос-ответ с помощью AI, позволяющая сосредоточиться на учёбе, а не на подготовке.

## Технологии
- **Backend:** FastAPI + SQLAlchemy (async) + PostgreSQL
- **AI:** Qwen API (OpenAI-compatible)
- **Frontend:** Vanilla JS
- **Контейнеризация:** Docker + Docker Compose
- **Миграции:** Alembic
- **Аутентификация:** JWT tokens

## Архитектура проекта
```
backend/
├── app/
│   ├── api/              # Роуты (endpoints)
│   │   ├── auth.py         # Регистрация и логин
│   │   ├── users.py        # Управление пользователями
│   │   ├── decks.py        # CRUD колод
│   │   ├── flashcards.py   # CRUD карточек + генерация
│   │   └── dependencies.py # Зависимости (auth)
│   ├── core/             # Конфигурация и утилиты
│   │   ├── config.py       # Настройки приложения
│   │   ├── database.py     # Подключение к БД
│   │   └── security.py     # JWT и хеширование
│   ├── models/           # SQLAlchemy модели
│   │   ├── user.py
│   │   ├── deck.py
│   │   └── flashcard.py
│   ├── schemas/          # Pydantic схемы
│   │   ├── user.py
│   │   ├── deck.py
│   │   ├── flashcard.py
│   │   └── token.py
│   ├── services/         # Бизнес-логика
│   │   ├── user_service.py
│   │   ├── deck_service.py
│   │   ├── flashcard_service.py
│   │   └── ai_service.py
│   └── main.py           # Точка входа
├── alembic/              # Миграции БД
├── requirements.txt
└── Dockerfile
```

## REST API Документация

### Базовый URL
```
http://localhost:8000/api/v1
```

### Интерактивная документация
После запуска перейдите на:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

### 🔐 Auth

#### Регистрация
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "student123",
  "password": "securepass123"
}

Response 200:
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

#### Логин
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123"
}

Response 200:
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

---

### 👤 Users

#### Получить текущего пользователя
```http
GET /api/v1/users/me
Authorization: Bearer <token>

Response 200:
{
  "id": 1,
  "email": "user@example.com",
  "username": "student123",
  "is_active": true,
  "created_at": "2026-04-08T10:00:00"
}
```

#### Обновить текущего пользователя
```http
PUT /api/v1/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newname",
  "password": "newpassword123"
}
```

---

### 📚 Decks (Колоды)

#### Создать колоду
```http
POST /api/v1/decks/
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Математика",
  "description": "Формулы и теоремы"
}

Response 201:
{
  "id": 1,
  "title": "Математика",
  "description": "Формулы и теоремы",
  "user_id": 1,
  "created_at": "2026-04-08T10:00:00"
}
```

#### Получить все колоды пользователя
```http
GET /api/v1/decks/
Authorization: Bearer <token>

Response 200:
[
  {
    "id": 1,
    "title": "Математика",
    "description": "Формулы и теоремы",
    "user_id": 1,
    "created_at": "2026-04-08T10:00:00"
  }
]
```

#### Получить колоду по ID
```http
GET /api/v1/decks/{deck_id}
Authorization: Bearer <token>
```

#### Обновить колоду
```http
PUT /api/v1/decks/{deck_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Обновлённое название"
}
```

#### Удалить колоду
```http
DELETE /api/v1/decks/{deck_id}
Authorization: Bearer <token>

Response 204: No Content
```

---

### 🃏 Flashcards (Карточки)

#### Создать карточку вручную
```http
POST /api/v1/flashcards/
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "Что такое теорема Пифагора?",
  "answer": "a² + b² = c²",
  "deck_id": 1
}

Response 201:
[
  {
    "id": 1,
    "question": "Что такое теорема Пифагора?",
    "answer": "a² + b² = c²",
    "deck_id": 1,
    "is_learned": false,
    "created_at": "2026-04-08T10:00:00"
  }
]
```

#### Получить все карточки колоды
```http
GET /api/v1/flashcards/deck/{deck_id}
Authorization: Bearer <token>
```

#### Получить не изученные карточки
```http
GET /api/v1/flashcards/unlearned/{deck_id}
Authorization: Bearer <token>
```

#### Обновить карточку
```http
PUT /api/v1/flashcards/{flashcard_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "is_learned": true
}
```

#### Удалить карточку
```http
DELETE /api/v1/flashcards/{flashcard_id}
Authorization: Bearer <token>

Response 204: No Content
```

#### 🤖 Сгенерировать карточки из текста (AI)
```http
POST /api/v1/flashcards/generate/{deck_id}?text=Ваш+учебный+материал&num_cards=5
Authorization: Bearer <token>

Response 201:
[
  {
    "id": 1,
    "question": "Что такое производная?",
    "answer": "Скорость изменения функции",
    "deck_id": 1,
    "is_learned": false,
    "created_at": "2026-04-08T10:00:00"
  }
]
```

---

## Features
### Реализовано
- [x] Генерация флешкарточек из текста через AI (Qwen).
- [x] PostgreSQL с асинхронным доступом через SQLAlchemy.
- [x] JWT аутентификация и приватные колоды.
- [x] Полный CRUD для пользователей, колод и карточек.
- [x] Бизнес-логика разделена на сервисы.
- [x] Alembic миграции.
- [x] Минималистичный Vanilla JS фронтенд.
- [x] Интерактивное переворачивание карточек.
- [x] Полностью контейнеризованное окружение.

### В планах
- [ ] Экспорт в Anki/Quizlet.
- [ ] Поддержка PDF/Image.
- [ ] Spaced repetition (SRS) расписание.
- [ ] Статистика изучения.
- [ ] Публичные колоды.

## Использование
1. **Зарегистрируйтесь:** `POST /api/v1/auth/register`
2. **Создайте колоду:** `POST /api/v1/decks/`
3. **Сгенерируйте карточки:** `POST /api/v1/flashcards/generate/{deck_id}?text=...`
4. **Изучайте:** Используйте фронтенд или API для просмотра карточек

## Развёртывание

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/KamilDV/se-toolkit-hackathon.git
   cd se-toolkit-hackathon
   ```

2. **Настройте окружение:**
   Создайте `.env` файл в корневой директории:
   ```env
   OPENAI_API_KEY=ваш_api_ключ
   ```

3. **Запустите с Docker Compose:**
   ```bash
   docker compose up --build -d
   ```
   Фронтенд будет доступен на `http://localhost`, бэкенд на `http://localhost:8000`.

4. **Примените миграции (опционально):**
   ```bash
   docker compose exec backend alembic upgrade head
   ```

## Локальная разработка (без Docker)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # и настройте его
uvicorn app.main:app --reload
```
