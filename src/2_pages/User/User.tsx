import { Menu } from '@features/Menu';
import { UserCard } from '@features/UserCard';
import { PageLayout } from '@shared/complex';
import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { t } from './User.translate';

export const User: FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const userIdNumber = userId ? parseInt(userId, 10) : 0;

    return (
        <PageLayout title={t('title')} headerRight={<Menu compact />}>
            {userIdNumber > 0 && <UserCard userId={userIdNumber} />}
        </PageLayout>
    );
};
