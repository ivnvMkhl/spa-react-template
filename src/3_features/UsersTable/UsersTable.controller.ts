import { type ControllerActionProps, ReactionController } from '@shared/services/reaction';

import type { NavigationExpect, UserApiExpect } from './UsersTable.interfaces';
import type { UsersTableState } from './UsersTable.state';

type ActionPayload = {
    NAVIGATE_TO_USER: { userId: number };
};

export class UsersTableController extends ReactionController {
    constructor(
        private readonly state: UsersTableState,
        private readonly navigation: NavigationExpect,
        private readonly userApi: UserApiExpect,
    ) {
        super();
        this.subscribe();
    }

    public readonly handleAction = async ({ type, payload }: ControllerActionProps<ActionPayload>) => {
        switch (type) {
            case 'NAVIGATE_TO_USER': {
                this.navigation.history.push(`/user-list/${payload.userId}`);
                break;
            }
        }
    };

    private readonly getUsers = async () => {
        return await this.asyncExecute(
            async () => {
                const result = await this.userApi.getUsers();
                return result ?? [];
            },
            (error) => {
                this.state.error = error;
            },
            (isLoading) => {
                this.state.isLoading = isLoading;
            },
        );
    };

    private readonly subscribe = () => {
        this.reaction([() => this.state.isRendered], async () => {
            if (this.state.isRendered) {
                const users = await this.getUsers();
                if (users) {
                    this.state.users = users;
                }
            }
        });
    };
}
