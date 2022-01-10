import { resolve } from "path";

import { appendElement, getWindow, updateElement } from "./components/Window";

import { CSSProperties } from "react";
import { Instance, WindowInstance, Type, Props, WindowProps, Container, LayoutStyle, ViewStyle, TextStyle } from "./types";

export function createWindowInstance(type: "window", props: WindowProps, rootContainer: Container): WindowInstance {
    const window = getWindow(
        props,
        src => {
            const path = resolve(__dirname, "..", "webview", src);
            return path;
        },
        (message) => console.log(message),
    )

    window.run().then(() => console.log("TODO: Windows closed."))

    return {
        id: "root",
        type,
        props,
        window,
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
    if (instance.type === "window") {
        console.log("Append window");
    } else {
        const window = getWindowInstance(instance);
        const id = instance.id;
        const parent = instance.parent;

        if (!id) throw new Error("Appended instance doesn't have id.");
        if (!parent) throw new Error("Appended instance doesn't have parent.");
        const parentId = parent.id;
        if (!parentId) throw new Error("Appended instance doesn't have parent.");

        appendElement(window.window, parentId, id, instance.type, instance.props);
    }
}

export function updateInstance(instance: Instance, newProps: Partial<Props>, /* rootContainer: Container*/) {
    if (instance.type === "window") {
        console.log("Update window");
    } else {
        const window = getWindowInstance(instance);
        const id = instance.id;

        if (!id) throw new Error("Appended instance doesn't have id.");

        updateElement(window.window, id, newProps);
    }
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
