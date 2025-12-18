import { LinkList } from '@shared/complex';
import type { AppPath } from '@shared/services/appSections';
import { navigation } from '@shared/services/navigation';
import { reactionObserver } from '@shared/services/reaction';
import { FC } from 'react';

import { menuPaths } from './Menu.constants';
import { MenuController } from './Menu.controller';
import { MenuState } from './Menu.state';

type Props = {
    compact?: boolean;
    hiddenPaths?: AppPath[];
};

const stateConstructor = () => new MenuState();
const controllerConstructor = (state: MenuState, props: Props) => {
    return new MenuController(state, navigation, menuPaths, props.hiddenPaths);
};

export const Menu: FC<Props> = reactionObserver(stateConstructor, controllerConstructor, ({ state, compact }) => {
    return <LinkList links={state.links} compact={compact} />;
});
