import { createTranslator } from '../translate';
import { reaction } from './reaction';
import ReactionControllerRu from './ReactionController.ru.json';

const t = createTranslator('shared', 'ReactionController', ReactionControllerRu);

export type ControllerActionProps<T extends object = object> = {
    [K in keyof T]: {
        type: K;
        payload: T[K];
    };
}[keyof T];

export class ReactionController {
    handleAction?: unknown;

    protected async asyncExecute<T>(
        loader: () => Promise<T>,
        setError: (error?: Error) => void,
        setIsLoading: (isLoading: boolean) => void,
        options?: { defaultErrorMessage?: string },
    ) {
        try {
            setIsLoading(true);
            setError(undefined);

            return await loader();
        } catch (error) {
            if (error instanceof Error) {
                setError(error);
            }
            const newError = new Error(options?.defaultErrorMessage ? options?.defaultErrorMessage : t('catchLoad'));
            setError(newError);
        } finally {
            setIsLoading(false);
        }
    }

    willUnmount() {}

    protected reaction(fieldsQuery: (() => unknown)[], action: () => void) {
        fieldsQuery.forEach((fieldQuery) => {
            reaction(fieldQuery, action);
        });
    }
}
