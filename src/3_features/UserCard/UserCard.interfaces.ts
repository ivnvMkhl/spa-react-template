import type { User } from '@entities/User';

export type UserApiExpect = {
    getUser: (id: number) => Promise<User>;
};
