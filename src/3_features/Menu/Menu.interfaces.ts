import type { AppPath } from '@shared/services/appSections';
import type { ReactNode } from 'react';

export type MenuLink = { key: string; onClick: () => void; label: ReactNode };

export type NavigationExpect = {
    history: { push: (path: string) => void };
    getDocumentTitle: (path: AppPath) => string;
};
