const appConfig = {
    baseURL: 'https://jsonplaceholder.typicode.com',
    reactionLogger: false,
    keycloak: {
        url: 'https://127.0.0.1:8081',
        realm: 'Realm',
        clientId: 'connector',
    },
};

window.appConfig = appConfig;
