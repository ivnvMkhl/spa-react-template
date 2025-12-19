# Testing

## Общие принципы

Проект использует **Vitest** для unit-тестирования. Все тесты должны быть изолированными, быстрыми и предсказуемыми.

## Тестирование Features

### Контроллеры

Все контроллеры features должны иметь unit-тесты в файле `{{ name }}.controller.test.ts`.

#### Структура теста

```typescript
import { macroTick } from '@shared/services/test';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { {{ name }}Controller } from './{{ name }}.controller';
import type { {{ Dependency }}Expect } from './{{ name }}.interfaces';
import { {{ name }}State } from './{{ name }}.state';

describe('Проверка контроллера', () => {
    let state: {{ name }}State;
    // Другие зависимости...

    beforeEach(() => {
        state = new {{ name }}State();
        // Инициализация моков...
    });

    it('Тестовый кейс', async () => {
        // Arrange
        new {{ name }}Controller(state, ...dependencies);

        // Act
        state.isRendered = true;
        await macroTick();

        // Assert
        expect(state.isLoading).equal(false);
        // Другие проверки...
    });
});
```

#### Dependency Injection через интерфейсы

Контроллеры используют dependency injection через интерфейсы из `{{ name }}.interfaces.ts`. Это позволяет легко мокировать зависимости в тестах:

```typescript
// UsersTable.interfaces.ts
export type NavigationExpect = {
    history: { push: (path: string) => void };
};

export type UserApiExpect = {
    getUsers: () => Promise<User[] | undefined>;
};

// UsersTable.controller.test.ts
let navigation: NavigationExpect;
let mockPush: Mock;
let userApi: UserApiExpect;
let mockGetUsers: Mock;

beforeEach(() => {
    mockPush = vi.fn();
    mockGetUsers = vi.fn();
    navigation = {
        history: {
            push: mockPush,
        },
    };
    userApi = {
        getUsers: mockGetUsers,
    };
});
```

#### Асинхронные реакции

Для тестирования асинхронных реакций MobX используется `macroTick`:

```typescript
it('Загрузка данных при монтировании компонента', async () => {
    mockGetUsers.mockResolvedValue(mockUsers);

    new UsersTableController(state, navigation, userApi);

    state.isRendered = true;
    await macroTick(); // Ожидание выполнения реакций

    expect(state.users).toEqual(mockUsers);
    expect(mockGetUsers).toHaveBeenCalledTimes(1);
});
```

#### Тестирование handleAction

Контроллеры могут иметь метод `handleAction` для обработки действий. Его также нужно тестировать:

```typescript
it('Навигация через handleAction', async () => {
    const controller = new UsersTableController(state, navigation, userApi);

    state.isRendered = true;
    await macroTick();

    await controller.handleAction({
        type: 'NAVIGATE_TO_USER',
        payload: { userId: 1 }
    });

    expect(mockPush).toHaveBeenCalledWith('/user-list/1');
});
```

#### Обработка ошибок

Тесты должны проверять обработку ошибок:

```typescript
it('Обработка ошибки при загрузке данных', async () => {
    const error = new Error('Failed to load users');
    mockGetUsers.mockRejectedValue(error);

    new UsersTableController(state, navigation, userApi);

    state.isRendered = true;
    await macroTick();

    expect(state.isLoading).equal(false);
    expect(state.error).toBeTruthy();
    expect(state.error instanceof Error).toBeTruthy();
});
```

## Тестирование Entities

### API сервисы

API сущностей могут иметь unit-тесты в файле `{{ name }}.api.test.ts`.

#### Структура теста

```typescript
import { RestService } from '@shared/services/rest';
import { NetworkError } from '@shared/services/rest';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { {{ name }}Api } from './{{ name }}.api';

vi.mock('@shared/services/rest');

describe('{{ name }}Api', () => {
    const mockBaseUrl = 'https://api.example.com';
    let {{ name }}Api: {{ name }}Api;
    let mockRequest: Mock;

    beforeEach(() => {
        vi.clearAllMocks();

        mockRequest = vi.fn();
        (RestService as Mock).mockImplementation(() => ({
            request: mockRequest,
        }));

        {{ name }}Api = new {{ name }}Api({ baseUrl: mockBaseUrl });
    });

    it('Тестовый кейс', async () => {
        // Arrange
        mockRequest.mockResolvedValue(mockData);

        // Act
        const result = await {{ name }}Api.getSomething();

        // Assert
        expect(mockRequest).toHaveBeenCalledWith('GET', `${mockBaseUrl}/path`, undefined, undefined);
        expect(result).toEqual(mockData);
    });
});
```

#### Мокирование RestService

Для изоляции тестов API мокируется `RestService`:

```typescript
vi.mock('@shared/services/rest');

beforeEach(() => {
    mockRequest = vi.fn();
    (RestService as Mock).mockImplementation(() => ({
        request: mockRequest,
    }));
});
```

#### Тестирование ошибок

API тесты должны проверять обработку ошибок и валидацию данных:

```typescript
it('Выбрасывает NetworkError при отсутствии данных', async () => {
    mockRequest.mockResolvedValue([]);

    await expect(userApi.getUser(1)).rejects.toThrow(NetworkError);

    try {
        await userApi.getUser(1);
    } catch (error) {
        expect(error).toBeInstanceOf(NetworkError);
        const networkError = error as NetworkError;
        expect(networkError.status).equal(404);
        expect(networkError.statusText).equal('NOT_FOUND');
    }
});
```

## Запуск тестов

### Запуск всех тестов

```bash
npm test
```

### Запуск конкретного теста

```bash
npm test -- src/3_features/UsersTable/UsersTable.controller.test.ts
```

## Покрытие кода тестами

Проект использует **@vitest/coverage-v8** для анализа покрытия кода тестами.

### Запуск тестов с покрытием

```bash
npm run test:coverage
```

Эта команда:
- Запускает все тесты
- Генерирует отчет о покрытии в консоли
- Создает HTML отчет в директории `coverage/`
- Создает JSON отчет для интеграции с CI/CD

### Просмотр HTML отчета

После запуска тестов с покрытием можно открыть HTML отчет:

```bash
npm run test:coverage:ui
```

Или вручную открыть файл `coverage/index.html` в браузере.

### Метрики покрытия

Отчет показывает следующие метрики:
- **% Stmts** - процент покрытых операторов
- **% Branch** - процент покрытых веток (if/else, switch и т.д.)
- **% Funcs** - процент покрытых функций
- **% Lines** - процент покрытых строк

### Исключения из покрытия

Следующие файлы автоматически исключаются из отчета о покрытии:
- `node_modules/`
- `dist/`
- `**/*.test.{ts,tsx}` - файлы тестов
- `**/*.config.{ts,js}` - конфигурационные файлы
- `**/index.ts` - файлы-экспорты
- `**/*.d.ts` - файлы определений TypeScript
- `**/*.translate.ts` - файлы с декларацией модульных переводов
- `**/*.constants.ts` - файлы с локальными константами
- `**/*.interfaces.ts`- файлы с типами
- `**/*.tsx` - React компоненты (presentation layer)
- `public/` - Дериктория для статических файлов
- `eslint-local-rules/` - Локальные правила eslint

### Настройка покрытия

Настройки покрытия находятся в `vite.config.ts` в секции `test.coverage`:

```typescript
test: {
    coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
            // список исключений
        ],
    },
}
```

## Best Practices

### ✅ Рекомендуется

- Использовать `beforeEach` для инициализации состояния перед каждым тестом
- Мокировать все внешние зависимости
- Тестировать как успешные сценарии, так и ошибки
- Использовать `macroTick` для ожидания асинхронных реакций MobX
- Группировать связанные тесты в `describe` блоки
- Использовать понятные названия тестов, описывающие проверяемое поведение

### ❌ Не рекомендуется

- Использовать реальные API вызовы в тестах
- Зависить от порядка выполнения тестов
- Использовать глобальное состояние между тестами
- Пропускать тестирование обработки ошибок
- Создавать слишком сложные моки (лучше использовать реальные интерфейсы)
