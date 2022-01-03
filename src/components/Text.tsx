import React, { ReactNode } from "react";
import { getCSSProperties } from "../instance";
import { LayoutStyle, ViewStyle, TextStyle } from "../types";

export type TextProps = {
    style?: Partial<TextStyle>,
    children: ReactNode,
};

export function Text({ style, children }: TextProps): JSX.Element {
    const cssProperties = getCSSProperties(style);

    return <span style={cssProperties}>{children}</span>;
}
