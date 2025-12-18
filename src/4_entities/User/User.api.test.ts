import { RestService } from '@shared/services/rest';
import { NetworkError } from '@shared/services/rest';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { UserApi } from './User.api';
import type { User } from './User.interfaces';

vi.mock('@shared/services/rest');

describe('UserApi', () => {
    const mockBaseUrl = 'https://api.example.com';
    let userApi: UserApi;
    let mockRequest: Mock;

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
        vi.clearAllMocks();

        mockRequest = vi.fn();
        (RestService as Mock).mockImplementation(() => ({
            request: mockRequest,
        }));

        userApi = new UserApi({ baseUrl: mockBaseUrl });
    });

    describe('getUsers', () => {
        it('вызывает get с правильным путем и возвращает пользователей', async () => {
            const mockUsers: User[] = [mockUser];
            mockRequest.mockResolvedValue(mockUsers);

            const result = await userApi.getUsers();

            expect(mockRequest).toHaveBeenCalledWith('GET', `${mockBaseUrl}/users`, undefined, undefined);
            expect(result).toEqual(mockUsers);
        });

        it('возвращает массив пользователей', async () => {
            const mockUsers: User[] = [mockUser, { ...mockUser, id: 2, name: 'Jane Smith' }];
            mockRequest.mockResolvedValue(mockUsers);

            const result = await userApi.getUsers();

            expect(result).toEqual(mockUsers);
            expect(result).toHaveLength(2);
        });
    });

    describe('getUser', () => {
        it('вызывает get с правильным query параметром', async () => {
            mockRequest.mockResolvedValue([mockUser]);

            await userApi.getUser(1);

            expect(mockRequest).toHaveBeenCalledWith('GET', `${mockBaseUrl}/users?id=1`, undefined, undefined);
        });

        it('возвращает пользователя если найден один с правильным id', async () => {
            mockRequest.mockResolvedValue([mockUser]);

            const result = await userApi.getUser(1);

            expect(result).toEqual(mockUser);
        });

        it('выбрасывает NetworkError если пользователь не найден', async () => {
            mockRequest.mockResolvedValue([]);

            await expect(userApi.getUser(1)).rejects.toThrow(NetworkError);
        });

        it('выбрасывает NetworkError если найдено несколько пользователей', async () => {
            mockRequest.mockResolvedValue([mockUser, { ...mockUser, id: 2 }]);

            await expect(userApi.getUser(1)).rejects.toThrow(NetworkError);
        });

        it('выбрасывает NetworkError если id не совпадает', async () => {
            const userWithWrongId = { ...mockUser, id: 2 };
            mockRequest.mockResolvedValue([userWithWrongId]);

            await expect(userApi.getUser(1)).rejects.toThrow(NetworkError);
        });

        it('выбрасывает NetworkError при пустом результате', async () => {
            mockRequest.mockResolvedValue(undefined);

            await expect(userApi.getUser(1)).rejects.toThrow();
        });
    });
});
