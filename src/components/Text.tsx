import React, { ReactNode } from "react";
import { LayoutStyle, ViewStyle, TextStyle } from "../types";

export type TextProps = {
    style?: Partial<TextStyle>,
    children: string,
};

export function Text({ children, ...props }: TextProps): JSX.Element {
    // @ts-ignore
    return <text text={children} {...props} />;
}
