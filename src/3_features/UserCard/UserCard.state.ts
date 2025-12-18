import type { User } from '@entities/User';
import { ObservableState } from '@shared/services/reaction';

export class UserCardState extends ObservableState {
    user?: User;

    constructor() {
        super();
        this.makeAutoObservable(this, {});
    }
}
