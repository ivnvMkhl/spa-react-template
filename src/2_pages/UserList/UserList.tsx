import { Menu } from '@features/Menu';
import { UsersTable } from '@features/UsersTable';
import { PageLayout } from '@shared/complex';
import { FC } from 'react';

import { t } from './UserList.translate';

export const UserList: FC = () => {
    return (
        <PageLayout title={t('title')} headerRight={<Menu compact />}>
            <UsersTable />
        </PageLayout>
    );
};
