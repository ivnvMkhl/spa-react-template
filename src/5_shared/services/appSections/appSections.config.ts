import { AppSection } from './appSections.interfaces';
import { AppPath } from './appSections.translate';

export type AppSectionsConfig = (Omit<AppSection<AppPath>, 'label' | 'children'> & { children: AppSectionsConfig })[];

export const appSectionsConfig: AppSectionsConfig = [
    {
        path: '/',
        component: 'Main',
        isDynamic: false,
        children: [
            {
                path: '/user-list',
                component: 'UserList',
                isDynamic: false,
                children: [
                    {
                        path: '/user-list/:userId',
                        component: 'User',
                        isDynamic: true,
                        children: [],
                    },
                ],
            },
        ],
    },
];
