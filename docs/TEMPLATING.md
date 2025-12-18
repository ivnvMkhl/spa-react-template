# Templating

Для генерации базовых шаблонов модулей используется библиотека [lekalo](https://www.npmjs.com/package/lekalo)

Шаблоны описаны в файле `.lekalo_templates.yml`

## Использование

### Генерация Feature

Для генерации feature модуля используется скрипт `create-feature`:

```bash
npm run create-feature

# Enter feature name: MyFeature
# Enter path: ./src/3_features
```

Или используйте параметризированную команду, которая не будет запрашивать диалог:

```bash
npm run create-feature name=MyFeature
```

**Генерируемые файлы для feature:**

- `{{ name }}.tsx` - основной компонент с `reactionObserver`
- `{{ name }}.state.ts` - класс State (расширяет `ObservableState`)
- `{{ name }}.controller.ts` - класс Controller (расширяет `ReactionController`)
- `{{ name }}.controller.test.ts` - базовые unit-тесты контроллера
- `{{ name }}.translate.ts` - функция локализации
- `{{ name }}.ru.json` - файл локализации (пустой объект)
- `index.ts` - экспорты модуля

**После генерации может потребоваться:**

- Создать `{{ name }}.interfaces.ts` для dependency injection (если нужно)
- Создать `{{ name }}.constants.ts` для констант (если нужно)
- Добавить зависимости в конструктор controller
- Реализовать бизнес-логику в controller
- Добавить поля в state
- Настроить реакции в методе `subscribe()`
- Добавить переводы в `{{ name }}.ru.json`

### Генерация Page

Для генерации page модуля используется скрипт `create-page`:

```bash
npm run create-page

# Enter page name: MyPage
# Enter path: ./src/2_pages
```

Или используйте параметризированную команду:

```bash
npm run create-page name=MyPage
```

**Генерируемые файлы для page:**

- `{{ name }}.tsx` - основной компонент страницы
- `{{ name }}.translate.ts` - функция локализации
- `{{ name }}.ru.json` - файл локализации (пустой объект)
- `index.ts` - экспорты модуля

**После генерации может потребоваться:**

- Добавить layout компонент (например, `PageLayout`)
- Интегрировать features и entities
- Добавить переводы в `{{ name }}.ru.json`
- Настроить routing в `@app/App/RouterProvider`

## Структура шаблонов

Шаблоны используют синтаксис `{{ variable }}` для подстановки значений:

- `{{ name }}` - имя модуля (например, `MyFeature`)
- `{{ path }}` - путь к директории модуля (например, `./src/3_features`)

Все шаблоны следуют соглашениям проекта:

- Features используют паттерн Controller-State (см. [CONTROLLER_STATE.md](./CONTROLLER_STATE.md))
- Локализация настроена для соответствующего слоя (`features` или `pages`)
- Тесты следуют структуре из [TESTING.md](./TESTING.md)

## Примеры

### Генерация feature с именем `UserProfile`

```bash
npm run create-feature name=UserProfile
```

Создаст структуру:
```
src/3_features/UserProfile/
  ├─ UserProfile.tsx
  ├─ UserProfile.state.ts
  ├─ UserProfile.controller.ts
  ├─ UserProfile.controller.test.ts
  ├─ UserProfile.translate.ts
  ├─ UserProfile.ru.json
  └─ index.ts
```

### Генерация page с именем `Settings`

```bash
npm run create-page name=Settings
```

Создаст структуру:
```
src/2_pages/Settings/
  ├─ Settings.tsx
  ├─ Settings.translate.ts
  ├─ Settings.ru.json
  └─ index.ts
```

## Дополнительная информация

- Шаблоны находятся в `.lekalo_templates.yml` и могут быть изменены при необходимости
- После генерации все файлы соответствуют архитектуре проекта (см. [ACHITECTURE.md](./ACHITECTURE.md))
- Сгенерированные тесты проходят базовые проверки и могут быть расширены
- Не забудьте добавить экспорты в `src/3_features/index.ts` или `src/2_pages/index.ts` при необходимости
