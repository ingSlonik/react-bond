import React, { ReactNode } from "react";
import { LayoutStyle, ViewStyle, TextStyle } from "../types";

export type PressableProps = {
    style?: Partial<LayoutStyle & ViewStyle>,
    onPress: () => void,
    children: ReactNode,
};

export function Pressable({ onPress, style, ...props }: PressableProps): JSX.Element {
    // @ts-ignore
    return <view style={{ ...style, cursor: "pointer" }} {...props} events={{ onPress }} />;
}