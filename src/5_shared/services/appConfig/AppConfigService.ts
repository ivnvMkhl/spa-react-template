import { ObjectSchema } from 'yup';

import { t } from './AppConfigService.translate';

class AppConfigService<AppConfig extends object> {
    constructor(
        readonly config: AppConfig,
        private readonly validationSchema: ObjectSchema<AppConfig>,
    ) {}

    validateConfig = (setError: (error: Error) => void) => {
        try {
            this.validationSchema.validateSync(this.config, { strict: true });
        } catch (error: Error | unknown) {
            if (error instanceof Error) {
                error.message = `${t('configValidationMessage')}: ${error.message}`;
                setError(error);
            }
        }
    };
}

export { AppConfigService };
