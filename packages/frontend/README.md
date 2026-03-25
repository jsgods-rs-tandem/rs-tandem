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

2. **Docker** — необходим для запуска Playwright в Linux-контейнере (критично для macOS, где Playwright не поддерживает WebKit нативно).

### Настройка Docker на macOS

Тесты используют `network_mode: 'host'`, чтобы контейнер мог обращаться к сервисам на `localhost`.

- **[OrbStack](https://orbstack.dev/)** (рекомендуется) — host networking работает из коробки, дополнительных настроек не требуется.
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
