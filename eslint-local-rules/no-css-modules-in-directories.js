export default {
    meta: {
        type: 'problem',
        messages: {
            noCssModules: '{{ message }}',
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
                                path: {
                                    type: 'string',
                                    description: 'Путь к директории (например, /src/2_pages/)',
                                },
                                message: {
                                    type: 'string',
                                    description: 'Сообщение об ошибке',
                                },
                            },
                            required: ['path', 'message'],
                        },
                    },
                },
                required: ['directories'],
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const options = context.options[0] || { directories: [] };
        const { directories } = options;
        const filename = context.getFilename();

        const matchedDirectory = directories.find((dir) => filename.includes(dir.path));
        if (!matchedDirectory) {
            return {};
        }

        return {
            ImportDeclaration(node) {
                const sourceValue = node.source.value;
                if (!sourceValue || typeof sourceValue !== 'string') {
                    return;
                }

                const cssPattern = /\.css(['"]|$|[\?])/;
                if (cssPattern.test(sourceValue)) {
                    context.report({
                        node,
                        messageId: 'noCssModules',
                        data: {
                            message: `Импорт CSS файлов запрещен в ${matchedDirectory.path}. ${matchedDirectory.message}`,
                        },
                    });
                }
            },
        };
    },
};



