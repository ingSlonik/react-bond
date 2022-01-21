import React, { ReactNode } from "react";
import { getCSSProperties } from "../instance";
import { LayoutStyle, ViewStyle, TransitionsStyle } from "../types";

export type PressableProps = {
    style?: Partial<LayoutStyle & ViewStyle & TransitionsStyle>,
    onPress: () => void,
    children: ReactNode,
};

export function Pressable({ onPress, style, children }: PressableProps): JSX.Element {
    const cssProperties = getCSSProperties(style);

    return <div style={{ ...cssProperties, cursor: "pointer" }} onClick={onPress}>{children}</div>;
}