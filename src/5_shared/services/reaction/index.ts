import { ReactionObserver } from './reactionObserver';

export { type ControllerActionProps, ReactionController } from './ReactionController';
export { ObservableState } from './ReactionObserverState';
export type { ReactionObserver };

export const { reactionObserver } = new ReactionObserver();
