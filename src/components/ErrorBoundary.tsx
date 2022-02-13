import React, { Component, ReactNode } from "react";

import { View } from "./View";
import { Text } from "./Text";

export type ErrorBoundaryProps = {
    children: ReactNode,
    onError?: (error: any) => JSX.Element,
};

type ErrorBoundaryState = {
    hasError: boolean,
    error: JSX.Element,
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: <Text>Something went wrong 😢.</Text>,
        };
    }

    static getDerivedStateFromError(error: any) {
        console.error(error);
        return { hasError: true };
    }

    componentDidCatch(error: any, errorInfo: any) {
        if (this.props.onError) {
            this.setState({ error: this.props.onError(error) });
        }
    }

    render() {
        if (this.state.hasError) {
            return this.state.error;
        } else {
            return this.props.children;
        }
    }
}

export function DevelopmentErrorBoundary({ children }: { children: ReactNode }): JSX.Element {
    if (global._reactBondHotReload) {
        return <ErrorBoundary onError={error => {
            let message = "";
            if (typeof error === "string") {
                message = error;
            } else if (error instanceof Error) {
                message = `${error.name} ${error.message}`;
            } else {
                message = JSON.stringify(error);
            }

            return <View style={{ flexGrow: 1, backgroundColor: "red", alignItems: "center" }}>
                <Text style={{ color: "black" }}>Something went wrong 😢.</Text>
                <Text style={{ color: "#444", textAlign: "center" }}>{message}</Text>
            </View>
        }}>
            {children}
        </ErrorBoundary>;
    } else {
        return <>{children}</>;
    }
}