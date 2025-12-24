import React, { Component, type ReactNode } from 'react';
import { Result, Button } from 'antd';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '50px', textAlign: 'center' }}>
                    <Result
                        status="error"
                        title="Something went wrong"
                        subTitle="We're sorry for the inconvenience. Please try refreshing the page."
                        extra={[
                            <Button type="primary" key="home" onClick={this.handleReset}>
                                Go Home
                            </Button>,
                            <Button key="reload" onClick={() => window.location.reload()}>
                                Reload Page
                            </Button>,
                        ]}
                    />
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
