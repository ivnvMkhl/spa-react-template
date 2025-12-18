import type { User } from '@entities/User';

export type NavigationExpect = {
    history: { push: (path: string) => void };
};

export type UserApiExpect = {
    getUsers: () => Promise<User[] | undefined>;
};
