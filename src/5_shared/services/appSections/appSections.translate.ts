import { createTranslator } from '../translate';
import appSectionsRu from './appSections.ru.json';

export const t = createTranslator('shared', 'appSections', appSectionsRu);
export type AppPath = Parameters<typeof t>['0'];
