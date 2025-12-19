import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintSimpleImportSort from 'eslint-plugin-simple-import-sort';
import postCSSModules from 'eslint-plugin-postcss-modules';
import prettierPlugin from 'eslint-plugin-prettier';
import { localRules } from './eslint-local-rules/index.js';
import importFirewallPlugin from 'eslint-plugin-import-firewall';

export default tseslint.config(
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            'simple-import-sort': eslintSimpleImportSort,
            'postcss-modules': postCSSModules,
            prettier: prettierPlugin,
            'local-rules': localRules,
            'import-firewall': importFirewallPlugin,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            'react-hooks/exhaustive-deps': 'off',
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'postcss-modules/no-undef-class': 'error',
            'postcss-modules/no-unused-class': 'error',
            'prettier/prettier': 'warn',
            'no-var': 'error',
            'prefer-const': 'error',
            'no-eval': 'error',
            'no-with': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            'local-rules/no-restricted-mobx-reaction-import': 'error',
            'local-rules/no-restricted-i18next-import': 'error',
            'local-rules/state-controller-must-extend': 'error',
            'local-rules/no-nested-components-directory': 'error',
            'local-rules/no-hooks-in-directories': [
                'error',
                {
                    directories: [
                        {
                            path: '/src/1_app/',
                            hooks: ['useState', 'createContext', 'useContext', 'Context'],
                            message:
                                'Создайте локальные провайдеры с state и controller или используйте готовые провайдеры из @shared/provides.',
                        },
                    ],
                },
            ],
            'local-rules/no-css-modules-in-directories': [
                'error',
                {
                    directories: [
                        {
                            path: '/src/1_app/',
                            message: 'Слой App не должн содержать CSS. Используйте готовые @pages',
                        },
                        {
                            path: '/src/2_pages/',
                            message:
                                'Страницы не должны содержать CSS. Создайте переиспользуемые Layout компоненты из @entities/ или @shared/complex.',
                        },
                        {
                            path: '/src/3_features/',
                            message:
                                'Фичи не должны содержать CSS. Используйте компоненты из @entities/components или @shared/complex.',
                        },
                    ],
                },
            ],
            'no-console': [
                'error',
                {
                    allow: ['warn', 'error', 'info'],
                },
            ],
            'import-firewall/import-firewall': [
                'error',
                {
                    layers: [
                        {
                            name: 'app',
                            path: '/src/1_app/',
                            alias: '@app/',
                            allowedImports: ['app', 'pages', 'features', 'entity', 'shared'],
                        },
                        {
                            name: 'pages',
                            path: '/src/2_pages/',
                            alias: '@pages/',
                            allowedImports: ['pages', 'features', 'entity', 'shared'],
                        },
                        {
                            name: 'features',
                            path: '/src/3_features/',
                            alias: '@features/',
                            allowedImports: ['features', 'entity', 'shared'],
                        },
                        {
                            name: 'entity',
                            path: '/src/4_entity/',
                            alias: '@entity/',
                            allowedImports: ['entity', 'shared'],
                        },
                        {
                            name: 'shared',
                            path: '/src/5_shared/',
                            alias: '@shared/',
                            allowedImports: ['shared'],
                        },
                    ],
                    srcDir: 'src',
                },
            ],
        },
    },

    // Отключаем правило для reaction в его сервисной директории
    {
        files: ['src/5_shared/services/reaction/**/*.{ts,tsx}'],
        rules: {
            'local-rules/no-restricted-mobx-reaction-import': 'off',
        },
    },

    // Отключаем правило для i18n в его сервисной директории
    {
        files: ['src/5_shared/services/translate/**/*.{ts,tsx}'],
        rules: {
            'local-rules/no-restricted-i18next-import': 'off',
        },
    },
);
