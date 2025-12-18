## Installation

Требуется версия `NodeJS >= 20`

Запустить установку зависимостей

```bash
npm ci
```

Если в ваши настройки NodeJS не запускают после `npm install` -> `npm run prepare`, запустите `npm run prepare` вручную.

## Pre-commit hook

Проект использует Husky для запуска pre-commit хуков. Перед каждым коммитом автоматически выполняются следующие проверки в указанном порядке:

1. **Build** (`npm run build`) - сборка проекта для проверки TypeScript ошибок
2. **Lint-staged** (`npm run lint-stage`) - проверка измененных файлов:
   - **Prettier** - автоматическое форматирование кода для файлов `src/**/*.{ts,tsx}`
   - **ESLint** - проверка кода на ошибки и соответствие правилам
3. **Tests** (`npm run test-stage`) - запуск всех unit-тестов

Если любая из проверок не проходит, коммит будет отклонен. Исправьте ошибки и попробуйте снова.

Вы можете запустить отдельные проверки вручную:

```bash
npm run build      # Сборка проекта
npm run lint-stage # Lint-staged проверки
npm run test-stage # Запуск тестов
```

## Configuration

Для работы приложения требуется файл с конфигурацией `public/config.js`

```JavaScript
const appConfig = {
    baseURL: 'https://127.0.0.1:8080', // API URL
    reactionLogger: false,             // Логгирование реакций MobX в консоль
    keycloak: {                        // Настроки keycloak
        url: 'https://127.0.0.1:8081',
        realm: 'Realm',
        clientId: 'connector',
    },
};

window.appConfig = appConfig;
```

## Development

Для запуска в dev режиме используйте скрипт. Девсервер запустится на `localhost:3000`

```bash
npm start
```

## Production

Продакшен сборка реализована через Docker.

## Documentation

Подробная документация проекта находится в папке [`docs/`](./docs/):

- **[ACHITECTURE.md](./docs/ACHITECTURE.md)** - Архитектура проекта, описание слоев и правил
- **[CONTROLLER_STATE.md](./docs/CONTROLLER_STATE.md)** - Паттерн Controller-State для управления состоянием
- **[TESTING.md](./docs/TESTING.md)** - Правила и примеры написания тестов
- **[LOCALIZATION.md](./docs/LOCALIZATION.md)** - Работа с локализацией
- **[TEMPLATING.md](./docs/TEMPLATING.md)** - Генерация модулей через шаблоны
