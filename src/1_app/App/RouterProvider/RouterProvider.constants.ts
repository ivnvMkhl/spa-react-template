import { Main, User, UserList } from '@pages/index';
import { FC } from 'react';

export const componentMap: Record<string, FC> = {
    Main,
    User,
    UserList,
} as const;

export type ComponentMapKey = keyof typeof componentMap;

export const isComponentKey = (key: string): key is ComponentMapKey => {
    return key in componentMap;
};
