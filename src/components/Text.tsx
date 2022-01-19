import React, { ReactNode } from "react";
import { getCSSProperties } from "../instance";
import { TextStyle, AnimationStyle } from "../types";

export type TextProps = {
    style?: Partial<TextStyle & AnimationStyle<TextProps>>,
    children: ReactNode,
};

export function Text({ style, children }: TextProps): JSX.Element {
    const cssProperties = getCSSProperties(style);

    return <span style={cssProperties}>{children}</span>;
}
