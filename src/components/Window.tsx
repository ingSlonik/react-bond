import React from "react";
import NativeWebView from "native-webview";

export type WindowProps = {
    title: string,
    icon: null | string,
    width: number,
    height: number,
    children: JSX.Element,
};

Window.defaultProps = {
    icon: null,
};

export function Window({ children, ...props }: WindowProps): JSX.Element {
    // @ts-ignore
    return <window {...props}>{children}</window>;
}
