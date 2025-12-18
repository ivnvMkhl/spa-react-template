# Localization

Для разработки используется Русский (ru) язык по модульной системе для создания карты токенов локализации.

## Общий подход

Все модули используют единый подход к локализации:

1. **{{ name }}.ru.json** - файл с переводами на русский язык
2. **{{ name }}.translate.ts** - функция `t()` для доступа к переводам (создается всегда)
3. Используется `createTranslator` с указанием слоя и имени модуля

### Структура файлов

Для каждого модуля создается отдельный файл `{{ name }}.translate.ts`, который экспортирует функцию `t()`:

```typescript
// {{ name }}.translate.ts
import { createTranslator } from '@shared/services/translate';

import {{ name }}Ru from './{{ name }}.ru.json';

export const t = createTranslator('{{ layer }}', '{{ name }}', {{ name }}Ru);
```

Где `{{ layer }}` - один из слоев: `'pages'`, `'features'`, `'entities'`, `'shared'`.

### JSON файл с переводами

```json
// {{ name }}.ru.json
{
  "title": "Заголовок",
  "errors": {
    "errorKey": "Текст ошибки"
  },
  "buttons": {
    "save": "Сохранить",
    "cancel": "Отмена"
  }
}
```

## Локализация по слоям

### `@pages/` (Страницы)

Используется группа `'pages'`:

```typescript
// Main.translate.ts
import { createTranslator } from '@shared/services/translate';

import MainRu from './Main.ru.json';

export const t = createTranslator('pages', 'Main', MainRu);
```

### `@features/` (Фичи)

Используется группа `'features'`:

```typescript
// UsersTable.translate.ts
import { createTranslator } from '@shared/services/translate';

import UsersTableRu from './UsersTable.ru.json';

export const t = createTranslator('features', 'UsersTable', UsersTableRu);
```

### `@entities/` (Сущности)

Используется группа `'entities'`:

```typescript
// User.translate.ts
import { createTranslator } from '@shared/services/translate';

import UserRu from './User.ru.json';

export const t = createTranslator('entities', 'User', UserRu);
```

### `@shared/` (Shared)

Для shared модулей используется группа `'shared'`:

```typescript
// AppConfigService.translate.ts
import { createTranslator } from '@shared/services/translate';

import AppConfigServiceRu from './AppConfigService.ru.json';

export const t = createTranslator('shared', 'AppConfigService', AppConfigServiceRu);
```

## Правила

- ✅ Всегда создавать отдельный файл `{{ name }}.translate.ts` для экспорта функции `t()`
- ✅ Использовать правильную группу в зависимости от слоя
- ✅ Имя модуля должно совпадать с названием файла (без расширения)
- ❌ Запрещается использовать одну функцию `t()` в рамках нескольких модулей
- ❌ Запрещается создавать экземпляр `t()` напрямую в компонентах (всегда через `{{ name }}.translate.ts`)

## Добавление нового языка

Для добавления нового языка нужно сделать полную выгрузку карты токенов разработки `localization.ru.json`. Это можно сделать средствами `JS`

```TypeScript
import { getLocalesMap } from '@shared/services/translate';

console.log(JSON.stringify(getLocalesMap()));
```

после этого нужно перевести текст в этом json и получить файл `localization.en.json`

затем добавьте этот файл в проект и задекларируйте новый язык в `@shared/services/translate/index.ts`

```TypeScript
import LocalizationEn from './localization.en.json'

const DEVELOP_LOCALE = 'ru';

i18n.init({
    resources: {
        [DEVELOP_LOCALE]: localeGroups,
        'en': LocalizationEn,
    },
    lng: DEVELOP_LOCALE,
    interpolation: { escapeValue: false },
});
```
