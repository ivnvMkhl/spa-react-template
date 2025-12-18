import { Menu } from '@features/Menu';
import { PageLayout } from '@shared/complex';
import { FC } from 'react';

import { t } from './Main.translate';

export const Main: FC = () => {
    return (
        <PageLayout title={t('title')}>
            <Menu hiddenPaths={['/']} />
        </PageLayout>
    );
};
