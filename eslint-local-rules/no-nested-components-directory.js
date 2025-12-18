export default {
    meta: {
        type: 'problem',
        messages: {
            noNestedComponents:
                'Запрещена вложенность components/components. Нельзя создавать компоненты второго уровня вложенности в @features/ и @entities/.',
        },
    },
    create(context) {
        const filename = context.getFilename();
        const normalizedPath = filename.replace(/\\/g, '/');
        const featuresPattern = /(^|\/)src\/3_features\/[^\/]+\/components\/[^\/]+\/components\//;
        const entitiesPattern = /(^|\/)src\/4_entities\/[^\/]+\/components\/[^\/]+\/components\//;

        if (featuresPattern.test(normalizedPath) || entitiesPattern.test(normalizedPath)) {
            return {
                Program(node) {
                    context.report({
                        node,
                        messageId: 'noNestedComponents',
                    });
                },
            };
        }

        return {};
    },
};

