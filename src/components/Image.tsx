import React, { ReactNode } from "react";
import { getCSSProperties } from "../instance";
import { SizeProps } from "../types";

export type ImageProps = {
    src: string,
    style?: Partial<SizeProps>,
};

export function Image({ src, style }: ImageProps): JSX.Element {
    const cssProperties = getCSSProperties(style);

    return <img src={src} style={cssProperties} />;
}
