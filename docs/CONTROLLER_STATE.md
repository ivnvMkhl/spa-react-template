# Controller-State Pattern

## Мотивация

Паттерн Controller-State используется для разделения ответственности в React компонентах:

- **State** - управление реактивным состоянием (MobX)
- **Controller** - бизнес-логика и побочные эффекты
- **Component** - чистое представление (presentation layer)

Это обеспечивает:
- ✅ Тестируемость бизнес-логики
- ✅ Переиспользуемость кода
- ✅ Разделение ответственности
- ✅ Предсказуемое управление состоянием
- ✅ Отсутствие необходимости использовать хуки в компонентах (кроме `useEffect` для подписки на изменение props)
- ✅ Предотвращение проникновения бизнес-логики в presentation layer

**Проблема без паттерна:**

Без Controller-State паттерна компоненты часто содержат:
- Множество хуков (`useState`, `useEffect`, `useCallback`, `useMemo`)
- Бизнес-логику, смешанную с представлением
- Сложность тестирования (нужно рендерить компонент целиком)
- Нарушение принципа единственной ответственности

## State Management

### ObservableState

Базовый класс для состояния компонента, расширяет `ObservableState` из `@shared/services/reaction`.

#### Базовые поля

Все состояния имеют следующие базовые поля:

```typescript
class ObservableState {
    isRendered = false;    // Флаг монтирования компонента
    isLoading = true;      // Флаг загрузки данных
    error?: Error;         // Ошибка, если произошла
}
```

#### Создание State

```typescript
import { ObservableState } from '@shared/services/reaction';

import type { User } from '@entities/User';

export class UsersTableState extends ObservableState {
    users: User[] = [];

    constructor() {
        super();
        this.makeAutoObservable(this, {});
    }
}
```

#### Настройка отслеживания полей

При вызове `this.makeAutoObservable(this, {})` можно переопределить поведение отслеживания для отдельных полей. По умолчанию все поля используют `observable.ref`, но можно указать:

- `'deep'` - глубокое отслеживание изменений (рекурсивно для объектов и массивов)
- `'shallow'` - поверхностное отслеживание (только первый уровень)
- `'off'` - отключить отслеживание для поля

**Пример использования:**

```typescript
export class UsersTableState extends ObservableState {
    users: User[] = [];           // По умолчанию: observable.ref
    filters = {                   // По умолчанию: observable.ref
        search: '',
        sort: 'name'
    };
    metadata: Record<string, unknown> = {}; // Отключено отслеживание

    constructor() {
        super();
        this.makeAutoObservable(this, {
            users: 'deep',           // Глубокое отслеживание массива пользователей
            filters: 'shallow',      // Поверхностное отслеживание фильтров
            metadata: 'off',         // Отключить отслеживание метаданных
        });
    }
}
```

**Когда использовать:**

- `'deep'` - для массивов объектов, когда нужно отслеживать изменения внутри элементов
- `'shallow'` - для объектов, когда нужно отслеживать замену свойств, но не изменения внутри
- `'off'` - для полей, которые не влияют на рендеринг (метаданные, кеш и т.д.)
- По умолчанию (`observable.ref`) - для примитивов и когда нужна только замена ссылки

#### Важно

- Всегда вызывать `this.makeAutoObservable(this, {})` в конструкторе
- Дополнительные поля должны быть инициализированы значениями по умолчанию
- State должен содержать только данные, без методов бизнес-логики
- Переопределение отслеживания опционально - по умолчанию используется `observable.ref` для всех полей

## Controller

### ReactionController

Базовый класс для контроллеров, расширяет `ReactionController` из `@shared/services/reaction`.

#### Основные методы

##### `asyncExecute` - Асинхронные операции

Вспомогательный метод для выполнения асинхронных операций с автоматическим управлением состояниями загрузки и ошибок:

```typescript
protected async asyncExecute<T>(
    loader: () => Promise<T>,
    setError: (error?: Error) => void,
    setIsLoading: (isLoading: boolean) => void,
    options?: { defaultErrorMessage?: string },
): Promise<T | undefined>
```

**Пример использования:**

```typescript
private readonly getUsers = async () => {
    return await this.asyncExecute(
        async () => {
            const result = await this.userApi.getUsers();
            return result ?? [];
        },
        (error) => {
            this.state.error = error;
        },
        (isLoading) => {
            this.state.isLoading = isLoading;
        },
    );
};
```

##### `reaction` - MobX реакции

Метод для создания реакций MobX:

```typescript
protected reaction(fieldsQuery: (() => unknown)[], action: () => void): void
```

**Важно:** В отличие от стандартной MobX реакции, этот метод позволяет отслеживать несколько полей одновременно с одним коллбеком. Метод создает отдельную реакцию для каждого поля из массива `fieldsQuery`, но все они выполняют один и тот же коллбек.

**Пример использования с одним полем:**

```typescript
private readonly subscribe = () => {
    this.reaction([() => this.state.isRendered], async () => {
        if (this.state.isRendered) {
            const users = await this.getUsers();
            if (users) {
                this.state.users = users;
            }
        }
    });
};
```

**Пример использования с несколькими полями:**

```typescript
private readonly subscribe = () => {
    // Реакция будет срабатывать при изменении любого из полей
    this.reaction(
        [
            () => this.state.isRendered,
            () => this.state.filters.search,
            () => this.state.filters.sortBy,
        ],
        async () => {
            if (this.state.isRendered) {
                await this.loadData();
            }
        }
    );
};
```

В этом примере реакция будет срабатывать при изменении любого из отслеживаемых полей: `isRendered`, `filters.search` или `filters.sortBy`.

##### `handleAction` - Обработка действий

Метод для обработки действий от компонента:

```typescript
public readonly handleAction = async ({ type, payload }: ControllerActionProps<ActionPayload>) => {
    switch (type) {
        case 'NAVIGATE_TO_USER': {
            this.navigation.history.push(`/user-list/${payload.userId}`);
            break;
        }
    }
};
```

**Типизация действий:**

```typescript
type ActionPayload = {
    NAVIGATE_TO_USER: { userId: number };
    DELETE_USER: { userId: number };
};
```

##### `willUnmount` - Очистка ресурсов

Метод вызывается при размонтировании компонента. Можно переопределить для очистки ресурсов:

```typescript
willUnmount() {
    // Очистка подписок, таймеров и т.д.
}
```

#### Dependency Injection

Контроллеры используют dependency injection через интерфейсы для обеспечения тестируемости и слабой связанности.

**Создание интерфейсов:**

```typescript
// UsersTable.interfaces.ts
import type { User } from '@entities/User';

export type NavigationExpect = {
    history: { push: (path: string) => void };
};

export type UserApiExpect = {
    getUsers: () => Promise<User[] | undefined>;
};
```

**Использование в контроллере:**

```typescript
export class UsersTableController extends ReactionController {
    constructor(
        private readonly state: UsersTableState,
        private readonly navigation: NavigationExpect,
        private readonly userApi: UserApiExpect,
    ) {
        super();
        this.subscribe();
    }
}
```

**Преимущества DI:**

- ✅ Легкое тестирование (можно мокировать зависимости)
- ✅ Слабая связанность компонентов
- ✅ Гибкость при замене реализаций

#### Структура контроллера

```typescript
import { type ControllerActionProps, ReactionController } from '@shared/services/reaction';

import type { NavigationExpect, UserApiExpect } from './UsersTable.interfaces';
import type { UsersTableState } from './UsersTable.state';

type ActionPayload = {
    NAVIGATE_TO_USER: { userId: number };
};

export class UsersTableController extends ReactionController {
    constructor(
        private readonly state: UsersTableState,
        private readonly navigation: NavigationExpect,
        private readonly userApi: UserApiExpect,
    ) {
        super();
        this.subscribe(); // Инициализация реакций
    }

    public readonly handleAction = async ({ type, payload }: ControllerActionProps<ActionPayload>) => {
        // Обработка действий
    };

    private readonly getUsers = async () => {
        // Приватные методы для работы с данными
    };

    private readonly subscribe = () => {
        // Настройка реакций
    };
}
```

## Module Structure

### Структура файлов

```
{{ name }}/
  ├─ {{ name }}.tsx                    # Компонент с reactionObserver
  ├─ {{ name }}.state.ts               # State класс
  ├─ {{ name }}.controller.ts          # Controller класс
  ├─ {{ name }}.interfaces.ts          # Интерфейсы для DI (опционально)
  ├─ {{ name }}.controller.test.ts     # Тесты контроллера
  ├─ {{ name }}.ru.json                # Локализация
  ├─ {{ name }}.translate.ts           # Функция локализации
  └─ index.ts                          # Экспорты
```

### Компонент с reactionObserver

Компонент использует `reactionObserver` для связи state и controller:

```typescript
import { reactionObserver } from '@shared/services/reaction';
import { FC } from 'react';

import { UsersTableController } from './UsersTable.controller';
import { UsersTableState } from './UsersTable.state';

type Props = {};

const stateConstructor = (_: Props) => new UsersTableState();
const controllerConstructor = (state: UsersTableState) => 
    new UsersTableController(state, navigation, userApi);

export const UsersTable: FC<Props> = reactionObserver(
    stateConstructor,
    controllerConstructor,
    ({ state, handleAction }) => {
        // Компонент получает state и handleAction из контроллера
        
        if (state.error) {
            return <Alert variant="error">{state.error.message}</Alert>;
        }

        if (state.isLoading) {
            return <Spinner />;
        }

        return <Table data={state.users} />;
    }
);
```

#### Работа с пропсами

##### Передача пропсов в State для initial values

Пропсы можно передавать в конструктор state для инициализации начальных значений:

```typescript
type Props = {
    initialPage: number;
};

const stateConstructor = (props: Props) => new UsersTableState(props.initialPage);

export class UsersTableState extends ObservableState {
    currentPage: number;

    constructor(initialPage: number) {
        super();
        this.currentPage = initialPage; // Инициализация из пропсов
        this.makeAutoObservable(this, {});
    }
}
```

##### Передача пропсов в Controller

Пропсы можно передавать в конструктор controller, но **только те, которые не изменяются** в процессе жизни компонента:

```typescript
type Props = {
    userId: number; // Не изменяется
    readonly config: Config; // Не изменяется
};

const controllerConstructor = (state: UserCardState, props: Props) => {
    // ✅ Можно передавать неизменяемые пропсы
    return new UserCardController(state, userApi, props.userId, props.config);
};
```

**⚠️ Важно:** Если передать изменяющийся проп в controller, реакция на его изменение будет потеряна, так как controller создается один раз при монтировании.

##### Работа с изменяющимися пропсами

Для пропсов, которые могут изменяться в процессе жизни компонента, нужно:

1. Создать поле в state
2. Передать initial value через конструктор state
3. Подписаться на изменение пропса в компоненте через `useEffect`

**Пример:**

```typescript
type Props = {
    userId: number; // Может изменяться
};

const stateConstructor = (props: Props) => new UserCardState(props.userId);

export class UserCardState extends ObservableState {
    userId: number; // Поле в state для отслеживания изменений

    constructor(initialUserId: number) {
        super();
        this.userId = initialUserId;
        this.makeAutoObservable(this, {});
    }
}

import { reactionObserver } from '@shared/services/reaction';
import { FC, useEffect } from 'react';

export const UserCard: FC<Props> = reactionObserver(
    stateConstructor,
    controllerConstructor,
    ({ state, handleAction, userId }) => {
        // Подписываемся на изменение пропса через useEffect
        useEffect(() => {
            state.userId = userId; // Обновляем state при изменении пропса
        }, [userId]); // state - observable, не нужно добавлять в зависимости

        // Компонент использует state.userId вместо props.userId
        return <div>User ID: {state.userId}</div>;
    }
);
```

А в controller можно подписаться на изменение этого поля через реакцию:

```typescript
private readonly subscribe = () => {
    this.reaction([() => this.state.userId], async () => {
        // Загружаем пользователя при изменении userId
        await this.getUser();
    });
};
```

**Важно:** В компоненте нельзя мутировать state напрямую. Все изменения состояния должны происходить через `handleAction`, который вызывает соответствующий метод в controller, где уже происходит мутация полей state. Это обеспечивает централизованное управление состоянием и упрощает тестирование.

**Исключение:** Единственное исключение - мутация state в `useEffect` для синхронизации изменяющихся props со state (как показано в примере выше). Это необходимо для того, чтобы изменения props отражались в реактивном state.

**❌ Неправильно:**
```typescript
export const UsersTable: FC<Props> = reactionObserver(
    stateConstructor,
    controllerConstructor,
    ({ state, handleAction }) => {
        // ❌ Нельзя мутировать state напрямую в компоненте
        const handleClick = () => {
            state.isLoading = true; // ❌ Плохо
            state.users = []; // ❌ Плохо
        };

        return <button onClick={handleClick}>Click</button>;
    }
);
```

**✅ Правильно:**
```typescript
export const UsersTable: FC<Props> = reactionObserver(
    stateConstructor,
    controllerConstructor,
    ({ state, handleAction }) => {
        // ✅ Используем handleAction для изменения состояния
        const handleClick = () => {
            handleAction({ type: 'RELOAD_USERS', payload: null });
        };

        return <button onClick={handleClick}>Click</button>;
    }
);
```

А в controller уже происходит мутация:
```typescript
public readonly handleAction = async ({ type }: ControllerActionProps<ActionPayload>) => {
    switch (type) {
        case 'RELOAD_USERS': {
            // ✅ Мутация state происходит в controller
            this.state.isLoading = true;
            await this.getUsers();
            break;
        }
    }
};
```

### Жизненный цикл

1. **Монтирование компонента:**
   - Создается state через `stateConstructor`
   - Создается controller через `controllerConstructor`
   - Устанавливается `state.isRendered = true`
   - Запускаются реакции из `subscribe()`

2. **Обновление состояния:**
   - Изменения в state автоматически вызывают ре-рендер (MobX observer)
   - Реакции реагируют на изменения наблюдаемых полей

3. **Размонтирование компонента:**
   - Устанавливается `state.isRendered = false`
   - Вызывается `controller.willUnmount()`
   - Очищаются все подписки и реакции

### Правила

#### ✅ Рекомендуется

- Создавать отдельные интерфейсы для зависимостей контроллера
- Использовать `asyncExecute` для всех асинхронных операций
- Инициализировать реакции в методе `subscribe()`
- Использовать приватные методы для инкапсуляции логики
- Типизировать `ActionPayload` для `handleAction`

#### ❌ Не рекомендуется

- Выполнять бизнес-логику в компоненте
- Обращаться напрямую к сервисам из компонента (использовать DI)
- Модифицировать state напрямую из компонента (кроме синхронизации props через `useEffect`)
- Создавать глобальное состояние в controller (только локальное состояние в state)
- Использовать `useState`, `useCallback`, `useMemo` в компонентах с Controller-State паттерном
- Использовать `useEffect` для бизнес-логики (только для синхронизации изменяющихся props со state)
