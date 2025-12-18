/// <reference types="vite/client" />

declare global {
    declare interface AppConfig {
        baseURL: string;
        reactionLogger: boolean;
        keycloak: {
            url: string;
            realm: string;
            clientId: string;
        };
    }

    interface Window {
        appConfig: AppConfig;
        _debugReactionStores?: Map<string, object>;
    }
}

export {};
