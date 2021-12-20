import React, { ReactNode } from "react";
import { LayoutStyle, ViewStyle, TextStyle } from "../types";

export type ViewProps = {
    style?: Partial<LayoutStyle & ViewStyle>,
    children: ReactNode,
};

export function View(props: ViewProps): JSX.Element {
    // @ts-ignore
    return <view {...props} />;
}
