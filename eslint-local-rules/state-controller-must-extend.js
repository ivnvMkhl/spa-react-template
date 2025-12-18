export default {
    meta: {
        type: 'problem',
        messages: {
            stateMustExtend:
                'Файлы *.state.ts должны содержать класс, расширяющий ObservableState',
            controllerMustExtend:
                'Файлы *.controller.ts должны содержать класс, расширяющий ReactionController',
        },
    },
    create(context) {
        const filename = context.getFilename();
        const isStateFile = filename.endsWith('.state.ts');
        const isControllerFile = filename.endsWith('.controller.ts');

        if (!isStateFile && !isControllerFile) {
            return {};
        }

        const requiredBaseClass = isStateFile ? 'ObservableState' : 'ReactionController';
        const classDeclarations = [];

        return {
            ClassDeclaration(node) {
                classDeclarations.push(node);
            },
            'Program:exit'(node) {
                const hasValidClass = classDeclarations.some((classDecl) => {
                    if (!classDecl.superClass) {
                        return false;
                    }
                    if (
                        classDecl.superClass.type === 'Identifier' &&
                        classDecl.superClass.name === requiredBaseClass
                    ) {
                        return true;
                    }
                    return false;
                });

                if (!hasValidClass) {
                    if (classDeclarations.length > 0) {
                        context.report({
                            node: classDeclarations[0],
                            messageId: isStateFile ? 'stateMustExtend' : 'controllerMustExtend',
                        });
                    } else {
                        context.report({
                            node,
                            messageId: isStateFile ? 'stateMustExtend' : 'controllerMustExtend',
                        });
                    }
                }
            },
        };
    },
};

