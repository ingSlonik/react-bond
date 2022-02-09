import { CSSProperties } from "react";

import { LayoutStyle, ViewStyle, TextStyle } from "./types";

export function getCSSProperties(style?: Partial<LayoutStyle & ViewStyle & TextStyle>): CSSProperties {
    const cssProperties: CSSProperties = {};

    for (const key in style) {
        const keyLower = key.toLowerCase();
        let value = style[key];

        if (key === "transform") {
            value = value.map(tran => Object.keys(tran)
                .map(type => `${type}(${Array.isArray(tran[type]) ? tran[type].join(",") : tran[type]})`).join(" ")
            ).join(" ");
        } else if (keyLower.endsWith("duration") || keyLower.endsWith("delay")) {
            value = `${value}ms`;
        } else if (key === "animationKeyframes") {
            value = Object.keys(value).map(percent => `${percent}% {\n${getCSSString(value[percent])}\n}`).join("\n");
        } else if (
            typeof value === "number" &&
            (keyLower.includes("margin") || keyLower.includes("padding") || keyLower.includes("size") || keyLower.includes("radius") || keyLower.includes("width") || keyLower.includes("height") || keyLower.includes("top") || keyLower.includes("left") || keyLower.includes("bottom") || keyLower.includes("right"))
        ) {
            value = `${value}px`;
        }

        cssProperties[key] = value;
    }

    return cssProperties;
}

function getCSSString(style: Partial<LayoutStyle & ViewStyle & TextStyle>): string {
    const css = getCSSProperties(style);
    return Object.keys(css).map(key => `${camelToSnakeCase(key)}: ${css[key]};`).join("\n");
}

function camelToSnakeCase(camel: string): string {
    return camel.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}