# Руководство по стилю кода

## Содержание

- [1. Общие правила](#1-общие-правила)
  - [1.1 Prettier](#11-prettier)
  - [1.2 ESLint](#12-eslint)
  - [1.3 Импорты и экспорты](#13-импорты-и-экспорты)
  - [1.4 Нейминг](#14-нейминг)
  - [1.5 Использование var, let и const](#15-использование-var-let-и-const)
  - [1.6 Неявные приведения типов](#16-неявные-приведения-типов)
  - [1.7 Использование "!"](#17-использование-)
  - [1.8 Мутации и спред оператор](#18-мутации-и-спред-оператор)
  - [1.9 Optional chaining и Nullish operator](#19-optional-chaining-и-nullish-operator)
- [2. TypeScript](#2-typescript)
  - [2.1 Типы и интерфейсы](#21-типы-и-интерфейсы)
  - [2.2 Enum и Union](#22-enum-и-union)
  - [2.3 Использование as](#23-использование-as)
  - [2.4 Использование unknown и any](#24-использование-unknown-и-any)
  - [2.5 Использование satisfies](#25-использование-satisfies)
- [3. React](#3-react)
  - [3.1 Шаблон React компоненты](#31-шаблон-react-компоненты)
  - [3.2 Использование reactionObserver](#32-использование-reactionobserver)

---

## 1. Общие правила

### 1.1 Prettier

В проекте работает проверка синтаксиса с помощью Prettier. Для авто исправления есть скрипт **`npm run prettify`**.

**Настройки форматирования:**

- Табуляция - 4 пробела
- Максимальная длина строки - 120
- Приоритет на одинарные кавычки
- Точка с запятой в конце каждой строчки

> **Конфигурация Prettier:**
> ```json
> {
>   "semi": true,
>   "trailingComma": "all",
>   "singleQuote": true,
>   "printWidth": 120,
>   "tabWidth": 4
> }
> ```

### 1.2 ESLint

В проекте есть проверка код стиля с помощью ESLint. Для проверки файлов ESLint есть скрипт **`npm run lint`**. Не рекомендуется использовать автофикс ESLint кроме сортировки импортов.

**Подробная документация по правилам линтинга:** [LINTING.md](./LINTING.md)

### 1.3 Импорты и экспорты

В проекте используются **ES Modules**.

**Правила:**

- Все импорты собираются вверху каждого файла. Экспорты внизу или в месте декларации.
- Допускается использовать только именованные экспорты. Дефолтные экспорты запрещены.
- Экспорты типов декларируются через `export type {}`
- Импорты типов декларируются через `import type {} from ''`

**Пример:**

```tsx
import { LinkList } from '@shared/complex';
import type { AppPath } from '@shared/services/appSections';
import { navigation } from '@shared/services/navigation';
import { reactionObserver } from '@shared/services/reaction';
import { FC } from 'react';

import { menuPaths } from './Menu.constants';
import { MenuController } from './Menu.controller';
import { MenuState } from './Menu.state';

type Props = {
    compact?: boolean;
    hiddenPaths?: AppPath[];
};

export const Menu: FC<Props> = reactionObserver(/* ... */);
```

### 1.4 Нейминг

#### Общие правила

- Сокращения в нейминге запрещены.
- Использование больше 5 слов в нейминге запрещено.
- В нейминге рекомендуется избегать общих слов без уточнения содержимого: `data`, `settings`, `response`, `result`, `config`, `query`.

**Примеры:**

```tsx
// ❌ Неправильно
const userData = { id: 1, name: 'Luke' };
const getConfig = () => {
    return store.config;
};
const settings = { method: 'GET', url: 'https://api.example.com' };
const response = await fetch('https://api.example.com/todos').then(({ json }) => json());

// ✅ Правильно
const user = { id: 1, name: 'Luke' };
const getAppConfig = () => {
    return appStore.config;
};
const getUserFetchSettings = { method: 'GET', url: 'https://api.example.com' };
const todoList = await fetch('https://api.example.com/todos').then(({ json }) => json());
```

#### Структуры однотипных элементов

Для структур однотипных элементов используется либо множественное число, либо приставки `List` или `Map` в зависимости от того список это или мапа.

```tsx
// ❌ Неправильно
const userArr = [{ id: 1, name: 'Luke' }, { id: 2, name: 'Ben' }];
const lessonObj = { '#LSSN42983457': { date: '11.03.2023' } };

// ✅ Правильно
const users = [{ id: 1, name: 'Luke' }, { id: 2, name: 'Ben' }];
const lessons = { '#LSSN42983457': { date: '11.03.2023' } };

// ✅ Альтернативно правильно
const userList = [{ id: 1, name: 'Luke' }, { id: 2, name: 'Ben' }];
const lessonMap = { '#LSSN42983457': { date: '11.03.2023' } };
```

#### Стили именования

| Тип | Стиль | Пример |
|-----|-------|--------|
| Переменные и функции | `camelCase` | `const userName = 'Mike'` |
| Функции | `camelCase` с глаголом | `const getUserName = (userId: string) => { ... }` |
| Константы | `UPPER_CASE` | `const DEFAULT_TEXT_COLOR = '#000000'` |
| Типы | `PascalCase` | `type UserInfo = { ... }` |
| React компоненты | `PascalCase` | `const LoginForm: FC = () => { ... }` |
| Классы | `PascalCase` | `class UserService { ... }` |
| CSS классы (модули) | `camelCase` | `.loginInput { ... }` |
| Перечисления/константы | `PascalCase` | `const ButtonKind = { ... } as const` |

**Исключения:**

- Данные с бекенда в нейминге `snake_case` должны быть описаны в типах.
- Если имя типа пересекается с именем класса или компоненты React, при импорте можно переименовать тип: `import { type User as TUser } from '';`

**Примеры из проекта:**

```tsx
// Типы
export type MenuLink = { key: string; onClick: () => void; label: ReactNode };
export type NavigationExpect = {
    history: { push: (path: string) => void };
    getDocumentTitle: (path: AppPath) => string;
};

// Компоненты
export const Menu: FC<Props> = reactionObserver(/* ... */);
export const Alert: FC<Props> = ({ children, variant = 'error' }) => { /* ... */ };

// Классы
export class MenuState extends ObservableState { /* ... */ }
export class MenuController extends ReactionController { /* ... */ }
```

### 1.5 Использование var, let и const

**Правила:**

- ❌ Не используем `var`
- ✅ Используем везде `const`
- ⚠️ Используем `let` только в исключительных случаях, когда использование оправдано сильным выигрышем в производительности. Такая функция должна быть описана отдельно и помечена комментарием с описанием мотивации использования `let`. Исключение в тестах.

### 1.6 Неявные приведения типов

Неявные приведения типов и использование `.toString()` запрещены.

Для явного приведения типов используем конструкторы `Number()`, `String()`, `Boolean()`.

```tsx
// ❌ Неправильно
const num = +'42';
const str = 42.toString();
const bool = !!'true';

// ✅ Правильно
const num = Number('42');
const str = String(42);
const bool = Boolean('true');
```

### 1.7 Использование "!"

**Правила:**

- ✅ Использовать `!` можно только для единичного отрицания.
- ❌ Запрещено использовать `!!` для приведения к `boolean` типу.
- ❌ Использовать `!` для явного отсеивания `null` или `undefined` запрещено.

```tsx
// ❌ Неправильно
const isValidLength = !!value.length;
const rootNode = document.getElementById('root')!; // rootNode: HTMLElement

// ✅ Правильно
const isValid = !existedUserNames.includes(newUserName);
const isValidLength = Boolean(value.length);
const rootNode = document.getElementById('root'); // rootNode: HTMLElement | null
if (rootNode) {
    // работа с rootNode
}
```

### 1.8 Мутации и спред оператор

Мутации объектов и массивов запрещены. Для добавления или переписывания элемента в массиве или объекте создаем новую константу и с помощью спред оператора раскладываем в новую сущность старую и добавляем / переписываем новый элемент.

```tsx
const ids = [{ id: 1 }, { id: 2 }];
const newId = { id: 3 };

// ❌ Неправильно
ids.push(newId);

// ✅ Правильно
const updatedIds = [...ids, newId];
```

#### Исключение: reduce

Для ускорения работы кода допускается мутация аккумулятора в `reduce`. Предпочтительно использовать дженерик для типизации.

```tsx
type User = { id: string; country: string; name: string };
const users: User[] = [
    { id: '1', country: 'RU', name: 'Ivan' },
    { id: '2', country: 'US', name: 'John' },
    { id: '3', country: 'RU', name: 'Petr' },
];

// ✅ Предпочтительно: использование дженерика
const usersByCountry = users.reduce<Record<string, User[]>>((acc, user) => {
    if (!acc[user.country]) {
        acc[user.country] = [];
    }
    acc[user.country].push(user);
    return acc;
}, {});

// Пример с массивом (мутация аккумулятора для производительности)
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, num) => {
    acc += num;
    return acc;
}, 0);
```

#### Деструктуризация

Спред оператор и деструктуризацию можно использовать для сбора параметров в функции, сбор оставшихся элементов в массиве или объекте.

```tsx
// ✅ Правильно
const myFunction = (firstProp, ...restProps) => { /* ... */ };
const [firstElement, secondElement] = tupleArr;
const [firstElement, ...restElements] = array;
const { id, name, email } = user;
```

**Пример:**

```tsx
export const Menu: FC<Props> = reactionObserver(
    stateConstructor,
    controllerConstructor,
    ({ state, compact }) => {
        return <LinkList links={state.links} compact={compact} />;
    }
);
```

#### Функции без мутаций

Функции, принимающие массивы или объекты, должны возвращать новые значения, а не мутировать переданные параметры.

```tsx
// ❌ Неправильно - функция мутирует переданный массив
const addItemToArray = (array: number[], item: number) => {
    array.push(item);
    return array;
};

// ✅ Правильно - функция возвращает новый массив
const addItemToArray = (array: number[], item: number): number[] => {
    return [...array, item];
};

// ❌ Неправильно - функция мутирует переданный объект
const updateUser = (user: User, updates: Partial<User>) => {
    Object.assign(user, updates);
    return user;
};

// ✅ Правильно - функция возвращает новый объект
const updateUser = (user: User, updates: Partial<User>): User => {
    return { ...user, ...updates };
};
```

**Пример:**

```tsx
private readonly buildLinks = (paths: readonly AppPath[]) => {
    return paths
        .filter((path) => !this.hiddenPaths.includes(path))
        .map((path) => ({
            label: this.navigation.getDocumentTitle(path),
            key: path,
            onClick: () => {
                this.navigation.history.push(path);
            },
        }));
};
```

### 1.9 Optional chaining и Nullish operator

Использование `?.` разрешено так же как и оператора `??`.

```tsx
const theme = store?.theme ?? DEFAULT_THEME;
const filteredArray = array?.filter(filterFunction) ?? [];
```

**Пример:**

```tsx
const override = overrides?.[targetKey as AnnotationKeys<This>];
```

---

## 2. TypeScript

### 2.1 Типы и интерфейсы

- ✅ Используем **типы (type)** для всей типизации в проекте.
- ❌ Использование **интерфейсов (interface)** запрещено (исключение: глобальные типы в `global.d.ts`)

**Примеры из проекта:**

```tsx
// src/3_features/Menu/Menu.interfaces.ts
export type MenuLink = { key: string; onClick: () => void; label: ReactNode };

export type NavigationExpect = {
    history: { push: (path: string) => void };
    getDocumentTitle: (path: AppPath) => string;
};
```

### 2.2 Enum и Union

Используем Union вместо Enum. Enum стараемся избегать, исключая случаи когда импортируем enum из библиотек.

```tsx
// ✅ Правильно
type ButtonKind = 'default' | 'solid' | 'text' | 'ghost';
type AlertVariant = 'error' | 'warning' | 'info' | 'success';

// ❌ Неправильно
enum ButtonKind {
    DEFAULT = 'default',
    SOLID = 'solid',
    TEXT = 'text',
    GHOST = 'ghost'
}
```

**Пример:**

```tsx
type Props = {
    children: ReactNode;
    variant?: 'error' | 'warning' | 'info' | 'success';
};
```

#### Словари на основе Union

Если требуется создать словарь на основе перечисления, то используем `Record<> … as const`.

```tsx
type ButtonKind = 'default' | 'solid' | 'text' | 'ghost';

const buttonsLabel: Record<ButtonKind, string> = {
    default: 'Дефолтная кнопка',
    solid: 'Залитая кнопка',
    text: 'Кнопка в виде текста',
    ghost: 'Кнопка-призрак',
} as const;
```

#### Обработка Union значений

Для обработки списка значений из Union используем `switch … case` вместо `if {} else if {}`.

```tsx
const neededButton: ButtonKind[] = ['default', 'ghost', 'solid'];

const buttons = neededButton.map((buttonKind) => {
    switch (buttonKind) {
        case 'default':
            return <Button kind={buttonKind}>{buttonsLabel[buttonKind]}</Button>;
        case 'ghost':
            return <Button kind={buttonKind}>{buttonsLabel[buttonKind]}</Button>;
        case 'solid':
            return <Button kind={buttonKind}>{buttonsLabel[buttonKind]}</Button>;
        case 'text':
            return <Button kind={buttonKind}>{buttonsLabel[buttonKind]}</Button>;
    }
});
```

### 2.3 Использование as

Использование `as` для тайпкастинга запрещено.

```tsx
// ❌ Запрещено
myFunction(prop as NeededType);
```

**Использование `as` допустимо только в 4 случаях:**

1. Для переименовывания названия переменных в импортах
2. В выражении `as const` для фиксации типа, чтобы TypeScript ругался на попытку мутации
3. Для типизации начального значения аккумулятора в `reduce` (предпочтительнее использовать дженерик)
4. Когда не получается по-другому обойти TypeScript типизацию. помучаем как `// TODO:`

```tsx
// 1. Переименование в импортах
import { Button as AntdButton } from './antd';

// 2. as const
const notMutableObject = { name: 'Mike' } as const;

// 3. Начальное значение в reduce (предпочтительнее дженерик)
const usersByCountry = users.reduce<Record<string, User[]>>((acc, user) => {
    // ...
}, {});
```

### 2.4 Использование unknown и any

**Правила:**

- ❌ Запрещено использование `any`.
- ✅ Для неизвестных типов требуется задать ему тип `unknown` и добавить проверки на наличие и типы полей, выделив проверки в Type Guard.
- ❌ Использование `as` в тайпгардах запрещено.

```tsx
type ItemList = { id: string }[];

const isItemList = (query: unknown): query is ItemList => {
    if (Array.isArray(query)) {
        const predicateFn = (item: unknown) => {
            return (
                typeof item === 'object' &&
                item !== null &&
                'id' in item &&
                typeof item.id === 'string'
            );
        };
        return query.every(predicateFn);
    }
    return false;
};

const mapQueryToItemList = (queryResponse: unknown): ItemList | undefined => {
    if (isItemList(queryResponse)) {
        return queryResponse;
    }
    return undefined;
};
```

### 2.5 Использование satisfies

Использование оператора `satisfies` разрешено для проверки соответствия значения типу без изменения выводимого типа.

```tsx
type ButtonKind = 'default' | 'solid' | 'text' | 'ghost';

// ✅ Правильно - satisfies проверяет соответствие типу, но сохраняет точный тип значения
const buttonsLabel = {
    default: 'Дефолтная кнопка',
    solid: 'Залитая кнопка',
    text: 'Кнопка в виде текста',
    ghost: 'Кнопка-призрак',
} satisfies Record<ButtonKind, string>;

// Тип buttonsLabel будет выведен как точный объект, а не Record<ButtonKind, string>
// Это позволяет TypeScript проверять полноту объекта и сохранять точные типы значений
```

Использование `satisfies` предпочтительнее `as` когда нужно проверить соответствие типу без потери информации о конкретных значениях.

---

## 3. React

### 3.1 Шаблон React компоненты

**Правила:**

- Все React компоненты типизируются как `FC` (импортируется из `react`)
- Использование классовых компонентов запрещено (исключение: `ErrorBoundary`)
- Тип пропсов называем по имени компоненты + `Props` если тип экспортируется, если нет то можно просто `Props`
- Тип пропсов декларируется через дженерик `FC<>`, исключение - компоненты которые расширяются дженериками
- Пропсы вытаскиваем деструктуризацией из первого параметра компоненты

**Пример простого компонента:**

```tsx
import { FC } from 'react';

type Props = {
    children: ReactNode;
    variant?: 'error' | 'warning' | 'info' | 'success';
};

export const Alert: FC<Props> = ({ children, variant = 'error' }) => {
    return <div className={cx(styles.alert, styles[variant])}>{children}</div>;
};
```

**Пример компонента из entities (без state/controller):**

```tsx
import { FC } from 'react';

import type { User } from '../../User.interfaces';
import styles from './UserCardView.module.css';

type Props = {
    user: User;
};

export const UserCardView: FC<Props> = ({ user }) => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h2 className={styles.name}>{user.name}</h2>
                <p className={styles.username}>@{user.username}</p>
            </div>
            {/* ... */}
        </div>
    );
};
```

### 3.2 Использование reactionObserver

Для компонентов с состоянием используется паттерн `reactionObserver`. Это основной способ создания компонентов в `@features/`.

**Структура:**

1. Создается `State` класс, расширяющий `ObservableState`
2. Создается `Controller` класс, расширяющий `ReactionController`
3. Компонент использует `reactionObserver` для связи state, controller и UI

**Пример:**

```tsx
import { LinkList } from '@shared/complex';
import type { AppPath } from '@shared/services/appSections';
import { navigation } from '@shared/services/navigation';
import { reactionObserver } from '@shared/services/reaction';
import { FC } from 'react';

import { menuPaths } from './Menu.constants';
import { MenuController } from './Menu.controller';
import { MenuState } from './Menu.state';

type Props = {
    compact?: boolean;
    hiddenPaths?: AppPath[];
};

const stateConstructor = () => new MenuState();
const controllerConstructor = (state: MenuState, props: Props) => {
    return new MenuController(state, navigation, menuPaths, props.hiddenPaths);
};

export const Menu: FC<Props> = reactionObserver(
    stateConstructor,
    controllerConstructor,
    ({ state, compact }) => {
        return <LinkList links={state.links} compact={compact} />;
    }
);
```

```tsx
// Menu.state.ts
import { ObservableState } from '@shared/services/reaction';

import type { MenuLink } from './Menu.interfaces';

export class MenuState extends ObservableState {
    links: MenuLink[] = [];
    constructor() {
        super();
        this.makeAutoObservable(this, {});
    }
}
```

```tsx
// Menu.controller.ts
import type { AppPath } from '@shared/services/appSections';
import { ReactionController } from '@shared/services/reaction';

import type { NavigationExpect } from './Menu.interfaces';
import type { MenuState } from './Menu.state';

export class MenuController extends ReactionController {
    constructor(
        private readonly state: MenuState,
        private readonly navigation: NavigationExpect,
        private readonly menuPaths: readonly AppPath[],
        private readonly hiddenPaths: readonly AppPath[] = [],
    ) {
        super();
        this.subscribe();
    }

    private readonly buildLinks = (paths: readonly AppPath[]) => {
        return paths
            .filter((path) => !this.hiddenPaths.includes(path))
            .map((path) => ({
                label: this.navigation.getDocumentTitle(path),
                key: path,
                onClick: () => {
                    this.navigation.history.push(path);
                },
            }));
    };

    private readonly subscribe = () => {
        this.reaction([() => this.state.isRendered], async () => {
            if (this.state.isRendered) {
                this.state.isLoading = false;
                this.state.links = this.buildLinks(this.menuPaths);
            }
        });
    };
}
```

## Связанная документация

- [Архитектура проекта](./ACHITECTURE.md) - описание структуры и слоев проекта
- [Правила линтинга](./LINTING.md) - подробная документация по ESLint правилам
- [Локализация](./LOCALIZATION.md) - работа с переводами
- [Тестирование](./TESTING.md) - правила написания тестов
