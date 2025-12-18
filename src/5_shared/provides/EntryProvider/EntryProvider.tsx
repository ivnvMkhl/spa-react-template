import { appConfigService } from '@shared/services/appConfig';
import { authService } from '@shared/services/auth';
import { reactionObserver } from '@shared/services/reaction';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { configure as configureMobx } from 'mobx';
import type { FC, ReactNode } from 'react';

import { ErrorBoundary } from '../ErrorBoundary';
import { ThemeProvider } from '../ThemeProvider';
import { EntryProviderController } from './EntryProvider.controller';
import { EntryProviderState } from './EntryProvider.state';
import { t } from './EntryProvider.translate';

dayjs.extend(duration);

configureMobx({ enforceActions: 'never' });

type Props = {
    children: ReactNode;
};

const stateConstructor = () => new EntryProviderState();
const controllerConstructor = (state: EntryProviderState) =>
    new EntryProviderController(state, authService, appConfigService);

const EntryProvider: FC<Props> = reactionObserver(stateConstructor, controllerConstructor, ({ state, children }) => {
    if (state.isLoading) {
        return <>{t('loading')}</>;
    }
    return (
        <ErrorBoundary appError={state.error}>
            <ThemeProvider>{children}</ThemeProvider>
        </ErrorBoundary>
    );
});

export { EntryProvider };
