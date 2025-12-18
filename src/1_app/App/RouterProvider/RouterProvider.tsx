import { type AppSection, appSections } from '@shared/services/appSections';
import { navigation } from '@shared/services/navigation';
import { observer } from 'mobx-react-lite';
import type { FC, ReactNode } from 'react';
import { Route, Router, Switch } from 'react-router-dom';

import { componentMap, isComponentKey } from './RouterProvider.constants';

const getRoutes = (config: AppSection[]): ReactNode[] => {
    return config.map(({ component, path, children }) => {
        if (!isComponentKey(component)) {
            console.error(`Неизвестный компонент: ${component}`);

            return null;
        }

        const Component = componentMap[component];
        const routes: ReactNode[] = [];

        if (Component) {
            routes.push(
                <Route key={path} exact path={path}>
                    <Component />
                </Route>,
            );
        }

        if (children) {
            routes.push(...getRoutes(children));
        }

        return routes;
    });
};

export const RouterProvider: FC = observer(() => {
    return (
        <Router history={navigation.history}>
            <Switch>{getRoutes(appSections.sectionsTree)}</Switch>
        </Router>
    );
});
