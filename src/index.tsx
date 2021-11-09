import React from "react";

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

export function View(props): JSX.Element {
    // @ts-ignore
    return <view {...props} />;
}

export type TextProps = {
    children: string,
};

export function Text({ children, ...props }): JSX.Element {
    // @ts-ignore
    return <text text={children} {...props} />;
}

export type PressableProps = {
    style?: any,
    onPress: () => void,
    children: JSX.Element,
};

export function Pressable({ onPress, style, ...props }: PressableProps): JSX.Element {
    // @ts-ignore
    return <view style={{ ...style, cursor: "pointer" }} {...props} events={{ onPress }} />;
}