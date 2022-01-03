import { resolve } from "path";
import NativeWebView from "native-webview";

import { CSSProperties } from "react";

import { Instance, WindowInstance, Type, Props, WindowProps, Container, LayoutStyle, ViewStyle, TextStyle } from "./types";


export function createWindowInstance(type: "window", props: WindowProps, rootContainer: Container): WindowInstance {
    const webView = new NativeWebView({
        title: props.title,
        size: { width: props.width, height: props.width },
        windowIcon: props.icon,
        getPath: (nwv) => {
            const path = resolve(__dirname, "..", "webview", nwv.replace("nwv://", ""));
            console.log(path);
            return path;
        },
        onMessage: (message) => console.log(message),
    });

    webView.run().then(() => console.log("TODO: Windows closed."))

    return {
        id: "root",
        type,
        props,
        webView,
        parent: null,
        children: [],
    };
}

export function createInstance(type: Exclude<Type, "window">, props: Props, rootContainer: Container): Instance {
    return {
        id: null,
        type,
        props,
        parent: null,
        children: [],
    };
}

export function appendInitial(parent: Instance, child: Instance) {
    child.parent = parent;
    parent.children.push(child);
}

export function finalizeInitialChildren(instance: Instance, rootContainer: Container): boolean {
    const { id, children } = instance;
    if (id) {
        let finalize = false;
        children.forEach((child, i) => {
            if (child.id === null) {
                // render whole tree with ids
                finalize = true;
                child.id = `${id}.${i}`;
                child.parent = instance;

                appendInstance(child);
                finalizeInitialChildren(child, rootContainer);
            }
        });
        return finalize;
    } else {
        return false;
    }
}

export function appendInstance(instance: Instance) {
    const window = getWindowInstance(instance);
    const parent = instance.parent;

    if (!parent) throw new Error("Appended instance doesn't have parent.");

    window.webView.eval(`append(${JSON.stringify(parent.id)})`);
}

export function updateInstance(instance: Instance, newProps: Partial<Props>, rootContainer: Container) {
    const window = getWindowInstance(instance);
}

export function getWindowInstance(child: Instance): WindowInstance {
    if (child.type === "window") {
        return child;
    } else if (child.parent) {
        return getWindowInstance(child.parent);
    } else {
        throw new Error("Instance doesn't have window parent.");
    }
}

export function getCSSProperties(style?: Partial<LayoutStyle & ViewStyle & TextStyle>): CSSProperties {
    const cssProperties: CSSProperties = {};

    for (const key in style) {
        const keyLower = key.toLowerCase();
        const value = style[key];

        if (
            typeof value === "number" &&
            (keyLower.includes("margin") || keyLower.includes("padding") || keyLower.includes("size") || keyLower.includes("radius") || keyLower.includes("width") || keyLower.includes("height"))
        ) {
            cssProperties[key] = style[key] + "px";
        } else {
            cssProperties[key] = style[key];
        }
    }

    return cssProperties;
}