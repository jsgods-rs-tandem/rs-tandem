# @rs-tandem/frontend

The frontend application for the **RS Tandem** project, built using the [Angular](https://angular.io/) framework.

## 🚀 Getting Started

Run these commands from the **project root**:

```bash
### Development (only frontend)
npm run start:frontend

### Build all packages
npm run build

### Run tests
npm test
```

## 🧪 E2E Tests

E2E тесты запускаются через [Playwright](https://playwright.dev/) внутри Docker-контейнера.

### Предварительные условия

1. **Поднять стенд** — перед запуском E2E тестов необходимо **самостоятельно** запустить backend и frontend локально:

2. **Docker Desktop** — необходим для запуска Playwright в Linux-контейнере (критично для macOS/Windows, где Playwright не поддерживает WebKit нативно).

### Настройка Docker Desktop на macOS/Windows

Тесты используют `network_mode: 'host'`, чтобы контейнер мог обращаться к сервисам на `localhost`.

- **[OrbStack](https://orbstack.dev/)** (рекомендуется для macOS) — host networking работает из коробки, дополнительных настроек не требуется.
- **Docker Desktop** — необходимо вручную включить поддержку host networking:
  `Settings → Resources → Network → ✅ Enable host networking`

### Скрипты

Все скрипты запускаются из директории `packages/frontend`:

| Скрипт                    | Описание                                                      |
| ------------------------- | ------------------------------------------------------------- |
| `npm run e2e`             | Запуск всех E2E тестов                                        |
| `npm run e2e:update`      | Запуск тестов с обновлением скриншотов (`--update-snapshots`) |
| `npm run e2e:show-report` | Открыть HTML-отчёт последнего запуска                         |

### Скриншоты

Тесты используют visual regression через `toHaveScreenshot()`. При первом запуске или после изменений в UI необходимо создать/обновить baseline-скриншоты:

```bash
npm run e2e:update -w @rs-tandem/frontend
```

Скриншоты сохраняются рядом с тест-файлами и должны быть закоммичены в репозиторий.

## 🌍 Интернационализация (i18n)

Проект использует [Transloco](https://jsverse.github.io/transloco/) для рантайм-интернационализации с типобезопасными ключами переводов.

### Поддерживаемые языки

- 🇬🇧 English (`en`)
- 🇷🇺 Русский (`ru`)

### Структура файлов переводов

```
public/i18n/
├── en.json              # Глобальный скоуп (общие ошибки, UI)
├── ru.json
└── auth/
    ├── en.json          # Auth скоуп (sign-in, sign-up, валидация, ошибки)
    └── ru.json
```

- **Глобальный скоуп** — ключи, общие для всего приложения (например `errors.noConnection`)
- **Скоупы фич** — лениво загружаются по фичам (например `auth.signIn.title`)

### Типобезопасные ключи

Ключи переводов автоматически генерируются как TypeScript union-тип из JSON-файлов. Это обеспечивает автокомплит в IDE и ошибки компиляции при опечатках.

**Рабочий процесс при добавлении новых переводов:**

1. Добавить ключ в оба файла `en.json` и `ru.json`
2. Запустить `npm run i18n:generate-types` для регенерации типа `TranslationKey`
3. Использовать типизированный хелпер `injectTranslate()` в компонентах:

```typescript
import { injectTranslate } from '@/shared/utils/translate.helper';

// В классе компонента:
private t = injectTranslate();

// Автокомплит ✅, опечатка → ошибка компиляции ✅
this.t('auth.errorMessages.loginTitle');
```

### Скрипты i18n

Все скрипты запускаются из директории `packages/frontend`:

| Скрипт                        | Описание                                                 |
| ----------------------------- | -------------------------------------------------------- |
| `npm run i18n:generate-types` | Генерирует тип `TranslationKey` из JSON-файлов переводов |
| `npm run i18n:find`           | Находит отсутствующие или лишние ключи переводов         |
| `npm run i18n:extract`        | Извлекает ключи переводов из исходного кода              |
