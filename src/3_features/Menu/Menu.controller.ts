import type { AppPath } from '@shared/services/appSections';
import { ReactionController } from '@shared/services/reaction';

import type { NavigationExpect } from './Menu.interfaces';
import type { MenuState } from './Menu.state';

export class MenuController extends ReactionController {
    constructor(
        private readonly state: MenuState,
        private readonly navigation: NavigationExpect,
        private readonly menuPaths: readonly AppPath[],
        private readonly hiddenPaths: readonly AppPath[] = [],
    ) {
        super();
        this.subscribe();
    }

    private readonly buildLinks = (paths: readonly AppPath[]) => {
        return paths
            .filter((path) => !this.hiddenPaths.includes(path))
            .map((path) => ({
                label: this.navigation.getDocumentTitle(path),
                key: path,
                onClick: () => {
                    this.navigation.history.push(path);
                },
            }));
    };

    private readonly subscribe = () => {
        this.reaction([() => this.state.isRendered], async () => {
            if (this.state.isRendered) {
                this.state.isLoading = false;
                this.state.links = this.buildLinks(this.menuPaths);
            }
        });
    };
}
