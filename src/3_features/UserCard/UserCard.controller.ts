import { ReactionController } from '@shared/services/reaction';

import type { UserApiExpect } from './UserCard.interfaces';
import type { UserCardState } from './UserCard.state';

export class UserCardController extends ReactionController {
    constructor(
        private readonly state: UserCardState,
        private readonly userApi: UserApiExpect,
        private readonly userId: number,
    ) {
        super();
        this.subscribe();
    }

    private readonly getUser = async () => {
        return await this.asyncExecute(
            async () => {
                return await this.userApi.getUser(this.userId);
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
                const user = await this.getUser();
                if (user) {
                    this.state.user = user;
                }
            }
        });
    };
}
