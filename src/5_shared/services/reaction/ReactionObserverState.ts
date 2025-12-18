import { makeObservable, observable } from 'mobx';

type ExcludedKeys = 'toString' | 'makeAutoObservable' | 'requiredFields';

type AnnotationKeys<This> = Exclude<keyof This, ExcludedKeys>;

export class ObservableState {
    isRendered = false;
    isLoading = true;
    error?: Error;

    constructor() {}

    private readonly excludedFields = new Set(['makeAutoObservable', 'requiredFields']);
    protected readonly makeAutoObservable = <This extends object>(
        target: This,
        overrides?: {
            [P in AnnotationKeys<This>]?: 'deep' | 'shallow' | 'off';
        },
    ) => {
        const annotations = Object.keys(target).reduce((acc, targetKey) => {
            if (this.excludedFields.has(targetKey)) {
                return acc;
            }
            const override = overrides?.[targetKey as AnnotationKeys<This>];

            switch (override) {
                case 'deep':
                    return { ...acc, [targetKey]: observable };
                case 'shallow':
                    return { ...acc, [targetKey]: observable.shallow };
                case 'off':
                    return acc;
                default:
                    return { ...acc, [targetKey]: observable.ref };
            }
        }, {});
        makeObservable(target, annotations);
    };
}
