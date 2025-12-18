export default {
    meta: {
        type: 'problem',
        fixable: 'code',
        messages: {
            restrictedImport:
                "Используй создание локальной t() через import { createTranslator } from '@shared/services/translate' вместо импорта из 'i18next'.",
        },
    },
    create(context) {
        return {
            ImportDeclaration(node) {
                if (node.source.value === 'i18next' || node.source.value === 'node_modules/i18next') {
                    context.report({
                        node,
                        messageId: 'restrictedImport',
                        fix(fixer) {
                            return [
                                fixer.replaceText(
                                    node,
                                    `import { createTranslator } from '@shared/services/translate';`,
                                ),
                            ];
                        },
                    });
                }
            },
        };
    },
};



