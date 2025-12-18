import { NetworkError } from './NetworkError';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type RestServiceOptions = {
    successStatuses?: ReadonlyArray<number>;
    defaultHeaders?: Record<string, string>;
};

const DEFAULT_SUCCESS_STATUSES: ReadonlyArray<number> = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226];

export class RestService {
    private readonly successStatuses: ReadonlyArray<number>;
    private readonly defaultHeaders: Record<string, string>;

    constructor(options?: RestServiceOptions) {
        const successStatuses = options?.successStatuses ?? DEFAULT_SUCCESS_STATUSES;
        const defaultHeaders = options?.defaultHeaders ?? {};

        this.successStatuses = successStatuses;
        this.defaultHeaders = defaultHeaders;
    }

    protected readonly request = async <TResponse, TPayload = unknown, TErrorBody = unknown>(
        method: HttpMethod,
        url: string,
        payload?: TPayload,
        init?: RequestInit,
    ): Promise<TResponse | undefined> => {
        const headers = new Headers(this.defaultHeaders);

        if (init?.headers) {
            const extraHeaders = new Headers(init.headers);

            extraHeaders.forEach((value, key) => {
                headers.set(key, value);
            });
        }

        const hasPayload = payload !== undefined && method !== 'GET';
        const hasBodyInInit = init?.body !== undefined && init?.body !== null;

        const body: BodyInit | null | undefined =
            hasPayload && !hasBodyInInit
                ? (() => {
                      if (!headers.has('Content-Type')) {
                          headers.set('Content-Type', 'application/json');
                      }

                      return JSON.stringify(payload);
                  })()
                : (init?.body ?? undefined);

        const response = await fetch(url, {
            ...init,
            method,
            headers,
            body,
        });

        if (!this.successStatuses.includes(response.status)) {
            const text = await response.text().catch(() => undefined);

            const errorBody: TErrorBody | undefined = text !== undefined && text !== '' ? JSON.parse(text) : undefined;

            throw new NetworkError<TErrorBody>(`Network request failed with status ${response.status}`, {
                status: response.status,
                statusText: response.statusText,
                url: response.url || url,
                responseBody: errorBody,
            });
        }

        const text = await response.text();

        if (!text) {
            return undefined;
        }

        const parsed: TResponse = JSON.parse(text);

        return parsed;
    };
}
