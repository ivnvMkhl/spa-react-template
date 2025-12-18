import { RestService, type RestServiceOptions } from '@shared/services/rest';

export type ApiServiceOptions = RestServiceOptions & {
    baseUrl: string;
};

export class ApiService extends RestService {
    public readonly baseUrl: string;

    constructor(options: ApiServiceOptions) {
        const { baseUrl, ...restOptions } = options;
        super(restOptions);
        this.baseUrl = baseUrl;
    }

    public readonly get = async <TResponse, TErrorBody = unknown>(
        url: string,
        init?: RequestInit,
    ): Promise<TResponse | undefined> => {
        return this.request<TResponse, never, TErrorBody>('GET', this.buildUrl(url), undefined, init);
    };

    public readonly post = async <TResponse, TPayload = unknown, TErrorBody = unknown>(
        url: string,
        payload?: TPayload,
        init?: RequestInit,
    ): Promise<TResponse | undefined> => {
        return this.request<TResponse, TPayload, TErrorBody>('POST', this.buildUrl(url), payload, init);
    };

    public readonly put = async <TResponse, TPayload = unknown, TErrorBody = unknown>(
        url: string,
        payload?: TPayload,
        init?: RequestInit,
    ): Promise<TResponse | undefined> => {
        return this.request<TResponse, TPayload, TErrorBody>('PUT', this.buildUrl(url), payload, init);
    };

    public readonly delete = async <TResponse, TPayload = unknown, TErrorBody = unknown>(
        url: string,
        payload?: TPayload,
        init?: RequestInit,
    ): Promise<TResponse | undefined> => {
        return this.request<TResponse, TPayload, TErrorBody>('DELETE', this.buildUrl(url), payload, init);
    };

    public readonly update = async <TResponse, TPayload = unknown, TErrorBody = unknown>(
        url: string,
        payload?: TPayload,
        init?: RequestInit,
    ): Promise<TResponse | undefined> => {
        return this.request<TResponse, TPayload, TErrorBody>('PATCH', this.buildUrl(url), payload, init);
    };

    public readonly buildUrl = (path: string): string => {
        const trimmedBase = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
        const trimmedPath = path.startsWith('/') ? path.slice(1) : path;

        return `${trimmedBase}/${trimmedPath}`;
    };
}
