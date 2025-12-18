export default {
    meta: {
        type: 'problem',
        messages: {
            noHook: '{{ message }}',
            noHookType: '{{ message }}',
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
                                    description: 'Путь к директории (например, /src/1_app/)',
                                },
                                hooks: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                    },
                                    description: 'Список запрещенных хуков (например, ["useState", "createContext"])',
                                },
                                message: {
                                    type: 'string',
                                    description: 'Сообщение об ошибке',
                                },
                            },
                            required: ['path', 'hooks', 'message'],
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

        const { hooks, message } = matchedDirectory;
        const hooksSet = new Set(hooks);
        const isContextTypeForbidden = hooksSet.has('Context');

        return {
            ImportDeclaration(node) {
                if (node.source.value === 'react') {
                    node.specifiers.forEach((spec) => {
                        if (spec.type === 'ImportSpecifier') {
                            const importedName = spec.imported.name;

                            if (hooksSet.has(importedName)) {
                                context.report({
                                    node: spec,
                                    messageId: 'noHook',
                                    data: {
                                        message: `Использование ${importedName} запрещено в ${matchedDirectory.path}. ${message}`,
                                    },
                                });
                            }
                        }
                    });
                }
            },

            TSTypeReference(node) {
                if (!isContextTypeForbidden) {
                    return;
                }

                if (node.typeName && node.typeName.type === 'TSQualifiedName') {
                    const typeName = node.typeName;
                    if (
                        typeName.left &&
                        typeName.left.type === 'Identifier' &&
                        typeName.left.name === 'React' &&
                        typeName.right &&
                        typeName.right.type === 'Identifier' &&
                        typeName.right.name === 'Context'
                    ) {
                        context.report({
                            node,
                            messageId: 'noHookType',
                            data: {
                                message: `Использование типа Context запрещено в ${matchedDirectory.path}. ${message}`,
                            },
                        });
                    }
                } else if (
                    node.typeName &&
                    node.typeName.type === 'Identifier' &&
                    node.typeName.name === 'Context'
                ) {
                    context.report({
                        node,
                        messageId: 'noHookType',
                        data: {
                            message: `Использование типа Context запрещено в ${matchedDirectory.path}. ${message}`,
                        },
                    });
                }
            },

            CallExpression(node) {
                if (node.callee && node.callee.type === 'Identifier') {
                    const calleeName = node.callee.name;

                    if (hooksSet.has(calleeName)) {
                        context.report({
                            node,
                            messageId: 'noHook',
                            data: {
                                message: `Использование ${calleeName} запрещено в ${matchedDirectory.path}. ${message}`,
                            },
                        });
                    }
                }
            },
        };
    },
};



