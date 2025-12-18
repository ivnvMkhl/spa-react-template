import { macroTick } from '@shared/services/test';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { MenuController } from './Menu.controller';
import { NavigationExpect } from './Menu.interfaces';
import { MenuState } from './Menu.state';

describe('Провека контроллера', () => {
    let navigation: NavigationExpect;
    let mockPush: Mock;
    let state: MenuState;

    beforeEach(() => {
        state = new MenuState();
        mockPush = vi.fn();
        navigation = {
            history: {
                push: mockPush,
            },
            getDocumentTitle: (appPath) => {
                return {
                    '/': 'main',
                    '/user-list': 'User List',
                    '/user-list/:userId': 'User',
                }[appPath];
            },
        };
    });

    it('Формирование данных для отображения меню', async () => {
        new MenuController(state, navigation, ['/', '/user-list']);

        state.isRendered = true;
        await macroTick();

        expect(state.isLoading).equal(false);
        expect(state.error).equal(undefined);
        expect(state.isRendered).equal(true);
        expect(state.links).toHaveLength(2);

        expect(state.links[0].key).equal('/');
        expect(state.links[0].label).equal('main');
        expect(typeof state.links[0].onClick).equal('function');

        state.links[0].onClick();
        expect(mockPush).toHaveBeenCalledWith('/');

        expect(state.links[1].key).equal('/user-list');
        expect(state.links[1].label).equal('User List');
        expect(typeof state.links[1].onClick).equal('function');

        state.links[1].onClick();
        expect(mockPush).toHaveBeenCalledWith('/user-list');
    });

    it('Скрывает пути из hiddenPaths', async () => {
        new MenuController(state, navigation, ['/', '/user-list'], ['/']);

        state.isRendered = true;
        await macroTick();

        expect(state.isLoading).equal(false);
        expect(state.error).equal(undefined);
        expect(state.isRendered).equal(true);
        expect(state.links).toHaveLength(1);

        expect(state.links[0].key).equal('/user-list');
        expect(state.links[0].label).equal('User List');
        expect(state.links.some((link) => link.key === '/')).equal(false);
    });

    it('Скрывает несколько путей из hiddenPaths', async () => {
        new MenuController(state, navigation, ['/', '/user-list'], ['/', '/user-list']);

        state.isRendered = true;
        await macroTick();

        expect(state.links).toHaveLength(0);
    });

    it('Не скрывает пути если hiddenPaths пустой', async () => {
        new MenuController(state, navigation, ['/', '/user-list'], []);

        state.isRendered = true;
        await macroTick();

        expect(state.links).toHaveLength(2);
        expect(state.links[0].key).equal('/');
        expect(state.links[1].key).equal('/user-list');
    });
});
