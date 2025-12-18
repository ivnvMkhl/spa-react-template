import { ObservableState } from '@shared/services/reaction';

class EntryProviderState extends ObservableState {
    constructor() {
        super();
        this.makeAutoObservable(this, {});
    }
}

export { EntryProviderState };
