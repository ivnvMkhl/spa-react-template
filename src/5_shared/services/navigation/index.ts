import { appSections } from '@shared/services/appSections';

import { NavigationService } from './NavigationService';

export const navigation = new NavigationService(appSections);
export type { NavigationService };
