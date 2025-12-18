import { userApi } from '@entities/User';
import { UserCardView } from '@entities/User/components/UserCardView';
import { Alert, Spinner } from '@shared/complex';
import { reactionObserver } from '@shared/services/reaction';
import { FC } from 'react';

import { UserCardController } from './UserCard.controller';
import { UserCardState } from './UserCard.state';

type Props = {
    userId: number;
};

const stateConstructor = () => new UserCardState();
const controllerConstructor = (state: UserCardState, props: Props) => {
    return new UserCardController(state, userApi, props.userId);
};

export const UserCard: FC<Props> = reactionObserver(stateConstructor, controllerConstructor, ({ state }) => {
    if (state.error) {
        return <Alert variant="error">{state.error.message}</Alert>;
    }

    if (state.isLoading) {
        return <Spinner />;
    }

    if (!state.user) {
        return null;
    }

    return <UserCardView user={state.user} />;
});
