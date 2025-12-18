import { createTranslator } from '../translate';
import appConfigServiceRu from './AppConfigService.ru.json';

export const t = createTranslator('shared', 'AppConfigService', appConfigServiceRu);
export type AppPath = Parameters<typeof t>['0'];
