export interface NetworkErrorPayload<TErrorBody = unknown> {
    status: number;
    statusText: string;
    url: string;
    responseBody?: TErrorBody;
}

export class NetworkError<TErrorBody = unknown> extends Error {
    public readonly status: number;
    public readonly statusText: string;
    public readonly url: string;
    public readonly responseBody?: TErrorBody;

    constructor(message: string, { status, statusText, url, responseBody }: NetworkErrorPayload<TErrorBody>) {
        super(message);

        this.name = 'NetworkError';
        this.status = status;
        this.statusText = statusText;
        this.url = url;
        this.responseBody = responseBody;
    }

    public static isNetworkError = <N = unknown>(error: unknown): error is NetworkError<N> =>
        error instanceof NetworkError;
}
