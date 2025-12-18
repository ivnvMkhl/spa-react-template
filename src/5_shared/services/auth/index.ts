import { appConfigService } from '../appConfig';
import { AuthService } from './AuthService';

const authService = new AuthService(appConfigService.config);

export { authService };

export type { AuthService } from './AuthService';
