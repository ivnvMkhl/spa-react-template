import { createTranslator } from '../translate';
import authServiceRu from './AuthService.ru.json';

export const t = createTranslator('shared', 'AuthService', authServiceRu);
