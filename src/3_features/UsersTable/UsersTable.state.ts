import type { User } from '@entities/User';
import { ObservableState } from '@shared/services/reaction';

export class UsersTableState extends ObservableState {
    users: User[] = [];

    constructor() {
        super();
        this.makeAutoObservable(this, {});
    }
}
