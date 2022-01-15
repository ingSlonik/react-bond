import React, { ReactNode } from "react";
import { getCSSProperties } from "../instance";
import { SizeProps } from "../types";

export type ImageProps = {
    src: string,
    style?: Partial<SizeProps>,
};

export function Image({ src, style }: ImageProps): JSX.Element {
    const cssProperties = getCSSProperties(style);

    let url = src;
    if (!src.startsWith("http://") && !src.startsWith("https://") && !src.startsWith("data:")) {
        // custom file
        url = `file?src=${encodeURIComponent(src)}`;
    }

    return <img src={url} style={cssProperties} />;
}
