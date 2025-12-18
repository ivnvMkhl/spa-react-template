import { uuid } from '@shared/services/uuid';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';

import { appConfigService } from '../appConfig';
import { ReactionController } from './ReactionController';

export class ReactionObserver {
    private isDebugMode = false;
    constructor() {
        this.isDebugMode = Boolean(appConfigService.config?.reactionLogger);
        if (this.isDebugMode) {
            this.initDebugStorage();
        }
    }

    private readonly initDebugStorage = () => {
        if (window._debugReactionStores) {
            console.warn('debug reaction storage already exists');
        } else {
            window._debugReactionStores = new Map();
        }
    };

    private readonly writeToDebugStorage = (uiStore: object) => {
        if (!this.isDebugMode) {
            return;
        }

        const debugStorageKey = uiStore.constructor.name + '-' + uuid().slice(0, 8);
        window._debugReactionStores?.set(debugStorageKey, uiStore);
        return () => {
            window._debugReactionStores?.delete(debugStorageKey);
        };
    };

    readonly reactionObserver = <
        State extends { isRendered: boolean },
        Props extends object,
        Controller extends ReactionController,
    >(
        stateConstructor: (props: Props) => State,
        controllerConstructor: (state: State, props: Props) => Controller,
        Component: React.FunctionComponent<Props & { state: State; handleAction: Controller['handleAction'] }>,
    ) =>
        observer((props: Props) => {
            const state = useLocalObservable(() => stateConstructor(props));
            const { adapter, debugDisposer, handleAction } = useMemo(() => {
                const adapter = controllerConstructor(state, props);
                const debugDisposer = this.writeToDebugStorage(state);
                return { adapter, debugDisposer, handleAction: adapter?.handleAction };
            }, []);

            useEffect(() => {
                state.isRendered = true;
                return () => {
                    state.isRendered = false;
                    debugDisposer?.();
                    adapter.willUnmount();
                };
            }, []);

            return Component({ ...props, state, handleAction });
        });
}
