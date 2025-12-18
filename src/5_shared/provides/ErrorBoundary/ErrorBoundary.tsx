import React, { ErrorInfo, ReactNode } from 'react';

import styles from './ErrorBoundary.module.css';

interface Props {
    children: ReactNode;
    appError?: Error | undefined;
}
interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState((prevState) => ({ ...prevState, error, errorInfo }));
    }

    render() {
        if (this.state.hasError || this.props.appError) {
            return (
                <div className={styles.errorWrapper}>
                    <h1>Что-то пошло не так.</h1>
                    {(this.state.error && String(this.state.error)) ||
                        (this.props.appError && String(this.props.appError))}
                    <details className={styles.errorDetails}>
                        <summary>Подробнее</summary>
                        {this.state.errorInfo && this.state.errorInfo?.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}
