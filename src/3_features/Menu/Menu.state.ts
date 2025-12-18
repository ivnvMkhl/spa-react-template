import { ObservableState } from '@shared/services/reaction';

import type { MenuLink } from './Menu.interfaces';

export class MenuState extends ObservableState {
    links: MenuLink[] = [];
    constructor() {
        super();
        this.makeAutoObservable(this, {});
    }
}
