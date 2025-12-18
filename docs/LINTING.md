# Документация по правилам линтинга

## Обзор

Проект использует ESLint для проверки качества кода. Конфигурация находится в `eslint.config.js` и включает как стандартные правила, так и локальные правила проекта.

## Стандартные правила

### Плагины

- **@eslint/js** - базовые правила JavaScript
- **typescript-eslint** - правила для TypeScript
- **eslint-plugin-react-hooks** - правила для React Hooks
- **eslint-plugin-react-refresh** - проверка экспорта компонентов
- **eslint-plugin-simple-import-sort** - автоматическая сортировка импортов
- **eslint-plugin-postcss-modules** - проверка использования CSS модулей
- **eslint-plugin-prettier** - интеграция с Prettier
- **eslint-plugin-import-firewall** - контроль импортов между слоями архитектуры

### Основные правила

- `simple-import-sort/imports` - автоматическая сортировка импортов
- `simple-import-sort/exports` - автоматическая сортировка экспортов
- `postcss-modules/no-undef-class` - проверка неопределенных CSS классов
- `postcss-modules/no-unused-class` - проверка неиспользуемых CSS классов
- `prettier/prettier` - форматирование кода через Prettier
- `no-console` - запрет `console.log` (разрешены `warn`, `error`, `info`)
- `import-firewall/import-firewall` - контроль импортов между слоями FSD

## Локальные правила

Локальные правила проекта находятся в директории `eslint-local-rules/` и автоматически подключаются через плагин `local-rules`.

## Добавление нового локального правила

### Шаг 1: Создание файла правила

Создайте новый файл в директории `eslint-local-rules/` с именем правила (например, `my-custom-rule.js`):

```javascript
export default {
    meta: {
        type: 'problem', // или 'suggestion', 'layout'
        fixable: 'code', // опционально, если правило может автоматически исправлять код
        messages: {
            myCustomError: 'Описание ошибки',
        },
        schema: [
            // опционально: схема для опций правила
            {
                type: 'object',
                properties: {
                    // опции правила
                },
            },
        ],
    },
    create(context) {
        // Получение опций правила
        const options = context.options[0] || {};
        
        // Получение имени файла
        const filename = context.getFilename();
        
        return {
            // Обработчики для различных типов AST узлов
            ImportDeclaration(node) {
                // Проверка импортов
            },
            ClassDeclaration(node) {
                // Проверка объявлений классов
            },
            'Program:exit'(node) {
                // Проверка после обработки всего файла
            },
        };
    },
};
```

### Шаг 2: Регистрация правила

Добавьте импорт и регистрацию правила в `eslint-local-rules/index.js`:

```javascript
import myCustomRule from './my-custom-rule.js';

export const localRules = {
    rules: {
        // ... существующие правила
        'my-custom-rule': myCustomRule,
    },
};
```

### Шаг 3: Включение правила в конфигурацию

Добавьте правило в `eslint.config.js`:

```javascript
rules: {
    // ... существующие правила
    'local-rules/my-custom-rule': 'error', // или 'warn', 'off'
    // или с опциями:
    'local-rules/my-custom-rule': [
        'error',
        {
            // опции правила
        },
    ],
},
```

## Примеры создания правил

### Пример 1: Проверка импортов

```javascript
export default {
    meta: {
        type: 'problem',
        messages: {
            restrictedImport: 'Использование {{ source }} запрещено. Используйте {{ alternative }}.',
        },
    },
    create(context) {
        return {
            ImportDeclaration(node) {
                const source = node.source.value;
                if (source === 'запрещенный-модуль') {
                    context.report({
                        node,
                        messageId: 'restrictedImport',
                        data: {
                            source: 'запрещенный-модуль',
                            alternative: '@shared/services/alternative',
                        },
                    });
                }
            },
        };
    },
};
```

### Пример 2: Проверка структуры файлов

```javascript
export default {
    meta: {
        type: 'problem',
        messages: {
            invalidStructure: 'Файл должен содержать класс, расширяющий {{ baseClass }}',
        },
    },
    create(context) {
        const filename = context.getFilename();
        const classDeclarations = [];
        
        return {
            ClassDeclaration(node) {
                classDeclarations.push(node);
            },
            'Program:exit'(node) {
                // Проверка после обработки всего файла
                const hasValidClass = classDeclarations.some((classDecl) => {
                    return classDecl.superClass?.name === 'RequiredBaseClass';
                });
                
                if (!hasValidClass) {
                    context.report({
                        node,
                        messageId: 'invalidStructure',
                        data: {
                            baseClass: 'RequiredBaseClass',
                        },
                    });
                }
            },
        };
    },
};
```

### Пример 3: Правило с опциями

```javascript
export default {
    meta: {
        type: 'problem',
        messages: {
            forbiddenInDirectory: '{{ message }}',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    directories: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                path: { type: 'string' },
                                message: { type: 'string' },
                            },
                            required: ['path', 'message'],
                        },
                    },
                },
                required: ['directories'],
            },
        ],
    },
    create(context) {
        const options = context.options[0] || { directories: [] };
        const { directories } = options;
        const filename = context.getFilename();
        
        const matchedDirectory = directories.find((dir) => 
            filename.includes(dir.path)
        );
        
        if (!matchedDirectory) {
            return {};
        }
        
        return {
            // Обработчики правил
        };
    },
};
```

## Полезные ресурсы

- [ESLint Developer Guide](https://eslint.org/docs/latest/developer-guide/working-with-rules)
- [AST Explorer](https://astexplorer.net/) - для изучения структуры AST
- [TypeScript ESLint](https://typescript-eslint.io/) - документация по TypeScript правилам

## Отладка правил

Для отладки правил можно использовать:

```javascript
create(context) {
    return {
        Program(node) {
            // Вывод информации в консоль (только для отладки)
            console.log('File:', context.getFilename());
            console.log('AST:', JSON.stringify(node, null, 2));
        },
    };
}
```
