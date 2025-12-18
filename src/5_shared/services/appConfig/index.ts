import { boolean, object, string } from 'yup';

import { AppConfigService } from './AppConfigService';

const configSchema = object({
    baseURL: string().required(),
    reactionLogger: boolean().required(),
    keycloak: object({
        url: string().url().required(),
        realm: string().required(),
        clientId: string().required(),
    }).required(),
}).noUnknown();

const appConfigService = new AppConfigService<AppConfig>(window.appConfig, configSchema);

export { appConfigService };
export type { AppConfigService };
