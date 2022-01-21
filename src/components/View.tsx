import React, { ReactNode } from "react";
import { getCSSProperties } from "../instance";
import { LayoutStyle, ViewStyle, TransitionsStyle, AnimationStyle } from "../types";

export type ViewProps = {
    style?: Partial<LayoutStyle & ViewStyle & TransitionsStyle & AnimationStyle<LayoutStyle & ViewStyle>>,
    children?: ReactNode,
};

export function View({ style, children }: ViewProps): JSX.Element {
    const cssProperties = getCSSProperties(style);

    return <div style={cssProperties}>{children}</div>;
}
