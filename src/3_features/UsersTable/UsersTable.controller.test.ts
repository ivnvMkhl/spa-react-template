import type { User } from '@entities/User';
import { macroTick } from '@shared/services/test';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { UsersTableController } from './UsersTable.controller';
import type { NavigationExpect, UserApiExpect } from './UsersTable.interfaces';
import { UsersTableState } from './UsersTable.state';

describe('Проверка контроллера', () => {
    let navigation: NavigationExpect;
    let mockPush: Mock;
    let userApi: UserApiExpect;
    let mockGetUsers: Mock;
    let state: UsersTableState;

    const mockUsers: User[] = [
        {
            id: 1,
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            phone: '123-456-7890',
            website: 'johndoe.com',
            address: {
                street: '123 Main St',
                suite: 'Apt 1',
                city: 'New York',
                zipcode: '10001',
                geo: {
                    lat: '40.7128',
                    lng: '-74.0060',
                },
            },
            company: {
                name: 'Acme Corp',
                catchPhrase: 'Best company ever',
                bs: 'business stuff',
            },
        },
        {
            id: 2,
            name: 'Jane Smith',
            username: 'janesmith',
            email: 'jane@example.com',
            phone: '098-765-4321',
            website: 'janesmith.com',
            address: {
                street: '456 Oak Ave',
                suite: 'Suite 2',
                city: 'Los Angeles',
                zipcode: '90001',
                geo: {
                    lat: '34.0522',
                    lng: '-118.2437',
                },
            },
            company: {
                name: 'Tech Inc',
                catchPhrase: 'Innovation first',
                bs: 'technology solutions',
            },
        },
    ];

    beforeEach(() => {
        state = new UsersTableState();
        mockPush = vi.fn();
        mockGetUsers = vi.fn();
        navigation = {
            history: {
                push: mockPush,
            },
        };
        userApi = {
            getUsers: mockGetUsers,
        };
    });

    it('Загрузка пользователей при монтировании компонента', async () => {
        mockGetUsers.mockResolvedValue(mockUsers);

        new UsersTableController(state, navigation, userApi);

        state.isRendered = true;
        await macroTick();

        expect(state.isLoading).equal(false);
        expect(state.error).equal(undefined);
        expect(state.isRendered).equal(true);
        expect(state.users).toHaveLength(2);
        expect(state.users).toEqual(mockUsers);
        expect(mockGetUsers).toHaveBeenCalledTimes(1);
    });

    it('Навигация к странице пользователя через handleAction', async () => {
        mockGetUsers.mockResolvedValue(mockUsers);

        const controller = new UsersTableController(state, navigation, userApi);

        state.isRendered = true;
        await macroTick();

        await controller.handleAction({ type: 'NAVIGATE_TO_USER', payload: { userId: 1 } });

        expect(mockPush).toHaveBeenCalledWith('/user-list/1');
    });

    it('Обработка ошибки при загрузке пользователей', async () => {
        const error = new Error('Failed to load users');
        mockGetUsers.mockRejectedValue(error);

        new UsersTableController(state, navigation, userApi);

        state.isRendered = true;
        await macroTick();

        expect(state.isLoading).equal(false);
        expect(state.error).toBeTruthy();
        expect(state.error instanceof Error).toBeTruthy();
        expect(state.users).toHaveLength(0);
    });

    it('Обработка undefined результата от getUsers', async () => {
        mockGetUsers.mockResolvedValue(undefined);

        new UsersTableController(state, navigation, userApi);

        state.isRendered = true;
        await macroTick();

        expect(state.isLoading).equal(false);
        expect(state.error).equal(undefined);
        expect(state.users).toHaveLength(0);
    });
});
