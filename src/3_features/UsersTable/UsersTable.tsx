import type { User } from '@entities/User';
import { userApi } from '@entities/User';
import { Alert, NativeLink, Spinner, Table, type TableColumn } from '@shared/complex';
import { navigation } from '@shared/services/navigation';
import { reactionObserver } from '@shared/services/reaction';
import { FC } from 'react';

import { UsersTableController } from './UsersTable.controller';
import { UsersTableState } from './UsersTable.state';
import { t } from './UsersTable.translate';

const stateConstructor = () => new UsersTableState();
const controllerConstructor = (state: UsersTableState) => new UsersTableController(state, navigation, userApi);

export const UsersTable: FC = reactionObserver(stateConstructor, controllerConstructor, ({ state, handleAction }) => {
    const columns: TableColumn<User>[] = [
        {
            key: 'id',
            header: t('columns.id'),
            accessor: 'id',
        },
        {
            key: 'name',
            header: t('columns.name'),
            accessor: 'name',
            render: (value, row) => (
                <NativeLink
                    href={String(row.id)}
                    onClick={() => handleAction({ type: 'NAVIGATE_TO_USER', payload: { userId: row.id } })}
                >
                    {String(value)}
                </NativeLink>
            ),
        },
        {
            key: 'username',
            header: t('columns.username'),
            accessor: 'username',
        },
        {
            key: 'email',
            header: t('columns.email'),
            accessor: 'email',
        },
        {
            key: 'phone',
            header: t('columns.phone'),
            accessor: 'phone',
        },
        {
            key: 'city',
            header: t('columns.city'),
            accessor: (row) => row.address.city,
        },
        {
            key: 'company',
            header: t('columns.company'),
            accessor: (row) => row.company.name,
        },
    ];

    if (state.error) {
        return <Alert variant="error">{state.error.message}</Alert>;
    }

    if (state.isLoading) {
        return <Spinner />;
    }

    return <Table columns={columns} data={state.users} />;
});
