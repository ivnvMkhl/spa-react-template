export default {
    meta: {
        type: 'problem',
        fixable: 'code',
        messages: {
            restrictedImport:
                "Используй `import { reaction } from '@shared/services/reaction'` вместо импорта из 'mobx'.",
        },
    },
    create(context) {
        return {
            ImportDeclaration(node) {
                if (node.source.value === 'mobx') {
                    const reactionImport = node.specifiers.find(
                        (spec) => spec.type === 'ImportSpecifier' && spec.imported.name === 'reaction',
                    );

                    if (reactionImport) {
                        context.report({
                            node,
                            messageId: 'restrictedImport',
                            fix(fixer) {
                                return [
                                    fixer.replaceText(node, `import { reaction } from '@shared/services/reaction';`),
                                ];
                            },
                        });
                    }
                }
            },
        };
    },
};



