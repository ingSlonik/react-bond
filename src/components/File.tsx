import React, { ReactNode, useState } from "react";
import { getCSSProperties } from "../instance";
import { LayoutStyle, ViewStyle, TextStyle } from "../types";

export type FileProps = {
    message?: string,
    style?: Partial<LayoutStyle & ViewStyle>,
    dragStyle?: Partial<LayoutStyle & ViewStyle>,
    messageStyle?: Partial<TextStyle>,
    onFiles: (paths: string[]) => void,
};

export function File({ message = "Drop the file here", style, dragStyle, messageStyle, onFiles }: FileProps): JSX.Element {
    const cssProperties = getCSSProperties(style);
    const dragCssProperties = getCSSProperties(dragStyle);
    const messageCssProperties = getCSSProperties(messageStyle);

    const [drag, setDrag] = useState(false);

    return <div
        style={{
            border: "1px solid #888",
            outline: drag ? "2px solid #22F" : "none",
            backgroundColor: drag ? "#FFF" : "#F1F1F1",
            padding: "16px 32px",
            ...cssProperties,
            ...(drag ? dragCssProperties : {}),
        }}
        onDragEnter={e => setDrag(true)}
        onDragLeave={e => setDrag(false)}
        // @ts-ignore
        onDropFiles={(paths: string[]) => {
            if (drag) {
                onFiles(paths);
            }
            setDrag(false);
        }}
    >
        <span style={{ pointerEvents: "none", textAlign: "center", ...messageCssProperties }}>{message}</span>
    </div>;
}
