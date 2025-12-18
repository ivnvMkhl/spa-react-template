import type { User } from '@entities/User';
import { macroTick } from '@shared/services/test';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { UserCardController } from './UserCard.controller';
import type { UserApiExpect } from './UserCard.interfaces';
import { UserCardState } from './UserCard.state';

describe('Проверка контроллера', () => {
    let userApi: UserApiExpect;
    let mockGetUser: Mock;
    let state: UserCardState;
    const userId = 1;

    const mockUser: User = {
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
    };

    beforeEach(() => {
        state = new UserCardState();
        mockGetUser = vi.fn();
        userApi = {
            getUser: mockGetUser,
        };
    });

    it('Загрузка пользователя при монтировании компонента', async () => {
        mockGetUser.mockResolvedValue(mockUser);

        new UserCardController(state, userApi, userId);

        state.isRendered = true;
        await macroTick();

        expect(state.isLoading).equal(false);
        expect(state.error).equal(undefined);
        expect(state.isRendered).equal(true);
        expect(state.user).toEqual(mockUser);
        expect(mockGetUser).toHaveBeenCalledTimes(1);
        expect(mockGetUser).toHaveBeenCalledWith(userId);
    });

    it('Обработка ошибки при загрузке пользователя', async () => {
        const error = new Error('Failed to load user');
        mockGetUser.mockRejectedValue(error);

        new UserCardController(state, userApi, userId);

        state.isRendered = true;
        await macroTick();

        expect(state.isLoading).equal(false);
        expect(state.error).toBeTruthy();
        expect(state.error instanceof Error).toBeTruthy();
        expect(state.user).equal(undefined);
        expect(mockGetUser).toHaveBeenCalledWith(userId);
    });

    it('Передача правильного userId в getUser', async () => {
        const testUserId = 42;
        mockGetUser.mockResolvedValue({ ...mockUser, id: testUserId });

        new UserCardController(state, userApi, testUserId);

        state.isRendered = true;
        await macroTick();

        expect(mockGetUser).toHaveBeenCalledWith(testUserId);
        expect(state.user?.id).equal(testUserId);
    });
});
