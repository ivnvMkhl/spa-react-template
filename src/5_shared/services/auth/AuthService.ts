import Keycloak from 'keycloak-js';

import { t } from './AuthService.translate';

interface KeycloakConfig {
    url: string;
    realm: string;
    clientId: string;
}

export class AuthService {
    private keycloak: Keycloak;
    private readonly _AUTH_HEADER_PREFIX = 'Bearer';
    private readonly _TOKEN_VALIDITY_LEFT_SECONDS = 30;

    constructor(config: AppConfig) {
        const keycloakConfig: KeycloakConfig = {
            url: config.keycloak.url,
            realm: config.keycloak.realm,
            clientId: config.keycloak.clientId,
        };

        this.keycloak = new Keycloak(keycloakConfig);
        this.keycloak.onTokenExpired = () => this.getAccessToken();
    }

    init = async () => {
        if (this.keycloak.authenticated !== undefined) {
            return this.keycloak.authenticated;
        }

        try {
            const auth = await this.keycloak.init({
                flow: 'standard',
                onLoad: 'login-required',
                checkLoginIframe: false,
            });

            if (!auth) {
                throw new Error(t('initAuthError'));
            }

            history.pushState('', document.title, window.location.pathname + window.location.search);

            return auth;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : t('initAuthError'));
        }
    };

    logout() {
        return this.keycloak.logout();
    }

    getAccessToken: () => Promise<string> = async () => {
        try {
            await this.keycloak.updateToken(this._TOKEN_VALIDITY_LEFT_SECONDS);

            if (!this.keycloak.token) {
                throw new Error(t('tokenNotFound'));
            }

            return `${this._AUTH_HEADER_PREFIX} ${this.keycloak.token}`;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : t('getTokenError'));
        }
    };

    getUserProfile = () => {
        return this.keycloak.loadUserProfile();
    };
}
