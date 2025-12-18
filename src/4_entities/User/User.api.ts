import { ApiService } from '@shared/services/api';
import { NetworkError } from '@shared/services/rest';

import type { User } from './User.interfaces';
import { t } from './User.translate';

export class UserApi extends ApiService {
    constructor({ baseUrl }: { baseUrl: string }) {
        super({ baseUrl });
    }

    public readonly getUsers = () => {
        return this.get<User[]>('/users');
    };

    public readonly getUser = async (id: number): Promise<User> => {
        const params = new URLSearchParams({ id: String(id) });
        const path = `/users?${params}`;
        const foundUsers = await this.get<User[]>(path);
        if (foundUsers?.length != 1 || foundUsers?.[0].id !== id) {
            throw new NetworkError(t('errors.userNotFound'), {
                status: 404,
                statusText: 'NOT_FOUND',
                url: this.buildUrl(path),
            });
        }
        return foundUsers[0];
    };
}
