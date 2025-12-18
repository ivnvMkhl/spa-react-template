import { appConfigService } from '@shared/services/appConfig';

import { UserApi } from './User.api';

export const userApi = new UserApi({ baseUrl: appConfigService.config.baseURL });
export { UserCardView } from './components/UserCardView';
export type { Address, Company, User } from './User.interfaces';
