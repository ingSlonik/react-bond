import React, { ReactNode } from "react";
import { LayoutStyle, ViewStyle, TextStyle } from "./types";

export { render } from "./render";


export type WindowProps = {
    title: string,
    width: number,
    height: number,
    children: JSX.Element,
};

export function Window({ children, ...props }: WindowProps): JSX.Element {
    // @ts-ignore
    return <window window={props}>{children}</window>;
}

export type ViewProps = {
    style?: Partial<LayoutStyle & ViewStyle>,
    children: ReactNode,
};

export function View(props: ViewProps): JSX.Element {
    // @ts-ignore
    return <view {...props} />;
}

export type TextProps = {
    style?: Partial<TextStyle>,
    children: string,
};

export function Text({ children, ...props }: TextProps): JSX.Element {
    // @ts-ignore
    return <text text={children} {...props} />;
}

export type PressableProps = {
    style?: Partial<LayoutStyle & ViewStyle>,
    onPress: () => void,
    children: ReactNode,
};

export function Pressable({ onPress, style, ...props }: PressableProps): JSX.Element {
    // @ts-ignore
    return <view style={{ ...style, cursor: "pointer" }} {...props} events={{ onPress }} />;
}