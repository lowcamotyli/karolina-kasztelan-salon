import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-background-light px-6">
                    <div className="text-center max-w-md">
                        <h1 className="font-display text-4xl text-black mb-4">Coś poszło nie tak</h1>
                        <p className="text-text-light mb-8">
                            Przepraszamy, wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-primary text-white px-6 py-3 hover:bg-primary-dark transition-colors uppercase tracking-widest text-xs"
                        >
                            Odśwież stronę
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
