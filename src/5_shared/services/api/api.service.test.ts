import { RestService } from '@shared/services/rest';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { ApiService } from './api.service';

vi.mock('@shared/services/rest');

describe('ApiService', () => {
    const mockBaseUrl = 'https://api.example.com';
    const mockResponse = { id: 1, name: 'John' };

    beforeEach(() => {
        vi.clearAllMocks();

        const mockRequest = vi.fn();
        (RestService as Mock).mockImplementation(() => ({
            request: mockRequest,
        }));
    });

    describe('constructor', () => {
        it('передает опции без baseUrl в родительский класс', () => {
            const options = {
                baseUrl: mockBaseUrl,
                headers: { Authorization: 'Bearer token' },
            };

            new ApiService(options);

            expect(RestService).toHaveBeenCalledWith({
                headers: { Authorization: 'Bearer token' },
            });
        });
    });

    describe('HTTP методы', () => {
        it('GET вызывает request с правильными параметрами', async () => {
            const service = new ApiService({ baseUrl: mockBaseUrl });
            const mockRequestInstance = (service as unknown as { request: ReturnType<typeof vi.fn> }).request;
            mockRequestInstance.mockResolvedValue(mockResponse);

            const result = await service.get('/users');

            expect(mockRequestInstance).toHaveBeenCalledWith('GET', `${mockBaseUrl}/users`, undefined, undefined);
            expect(result).toEqual(mockResponse);
        });

        it('POST вызывает request с payload', async () => {
            const service = new ApiService({ baseUrl: mockBaseUrl });
            const mockRequestInstance = (service as unknown as { request: ReturnType<typeof vi.fn> }).request;
            mockRequestInstance.mockResolvedValue(mockResponse);
            const payload = { name: 'John' };

            await service.post('/users', payload);

            expect(mockRequestInstance).toHaveBeenCalledWith('POST', `${mockBaseUrl}/users`, payload, undefined);
        });

        it('PUT вызывает request с payload', async () => {
            const service = new ApiService({ baseUrl: mockBaseUrl });
            const mockRequestInstance = (service as unknown as { request: ReturnType<typeof vi.fn> }).request;
            const payload = { name: 'Jane' };

            await service.put('/users/1', payload);

            expect(mockRequestInstance).toHaveBeenCalledWith('PUT', `${mockBaseUrl}/users/1`, payload, undefined);
        });

        it('DELETE вызывает request', async () => {
            const service = new ApiService({ baseUrl: mockBaseUrl });
            const mockRequestInstance = (service as unknown as { request: ReturnType<typeof vi.fn> }).request;

            await service.delete('/users/1');

            expect(mockRequestInstance).toHaveBeenCalledWith('DELETE', `${mockBaseUrl}/users/1`, undefined, undefined);
        });

        it('PATCH вызывает request с payload', async () => {
            const service = new ApiService({ baseUrl: mockBaseUrl });
            const mockRequestInstance = (service as unknown as { request: ReturnType<typeof vi.fn> }).request;
            const payload = { name: 'Updated' };

            await service.update('/users/1', payload);

            expect(mockRequestInstance).toHaveBeenCalledWith('PATCH', `${mockBaseUrl}/users/1`, payload, undefined);
        });
    });

    describe('построение URL', () => {
        it('правильно обрабатывает baseUrl и path со слешами', () => {
            const service = new ApiService({ baseUrl: 'https://api.example.com/' });
            const mockRequestInstance = (service as unknown as { request: ReturnType<typeof vi.fn> }).request;

            service.get('/users');

            expect(mockRequestInstance).toHaveBeenCalledWith(
                'GET',
                'https://api.example.com/users',
                undefined,
                undefined,
            );
        });

        it('правильно обрабатывает baseUrl и path без слешей', () => {
            const service = new ApiService({ baseUrl: 'https://api.example.com' });
            const mockRequestInstance = (service as unknown as { request: ReturnType<typeof vi.fn> }).request;

            service.get('users');

            expect(mockRequestInstance).toHaveBeenCalledWith(
                'GET',
                'https://api.example.com/users',
                undefined,
                undefined,
            );
        });
    });
});
