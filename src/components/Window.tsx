import { resolve } from "path";
import NativeWebView from "native-webview";

import React, { ReactNode } from "react";

import { DevelopmentErrorBoundary } from "./ErrorBoundary";

import { Type, Props } from "../types";

// ------------ Component -------------

export type WindowProps = {
    title: string,
    width: number,
    height: number,
    icon?: null | string,
    resizable?: boolean,
    minSize?: {
        width: number,
        height: number,
    },
    maxSize?: {
        width: number,
        height: number,
    },
    position?: {
        top: number,
        left: number,
    };
    alwaysOnTop?: boolean,
    decorations?: boolean,
    fullscreen?: boolean,
    maximized?: boolean,
    minimized?: boolean,
    children: ReactNode,
};

export function Window({ children, icon = null, ...props }: WindowProps): JSX.Element {
    // @ts-ignore
    return <window icon={icon} {...props}><DevelopmentErrorBoundary>{children}</DevelopmentErrorBoundary></window>;
}

// ------------ Backend -------------

export type MessageToFrontend =
    | { type: "append", parentId: string, id: string, tagName: Type, props: FrontendProps }
    | { type: "update", id: string, props: FrontendProps }
    | { type: "remove", id: string };

export type MessageToBackend =
    | { type: "loaded" }
    | { type: "message", message: string }
    | { type: "error", error: Error }
    | { type: "event", id: string, eventType: string, value: any };

type FrontendProps = {
    [Key in keyof Props as Lowercase<Key>]: Props[Key]; // string for listeners
};

const eventListener: { [id: string]: { [eventType: string]: (value: any) => void } } = {};
const dropListener: { [id: string]: (paths: string[]) => void } = {};

export type WindowType = {
    loaded: boolean,
    loadingQueue: string[],
    nwv: NativeWebView,
    run: () => Promise<void>,
};

export function getWindow(
    props: Omit<WindowProps, "children">
): WindowType {
    const nwv = new NativeWebView(
        {
            title: props.title,
            innerSize: { width: props.width, height: props.height },
            getPath: path => {
                if (path === "index.html") {
                    return resolve(__dirname, "..", "..", "webview", "index.html");
                } else {
                    if (path.startsWith("file?src=")) {
                        return resolve(process.cwd(), decodeURIComponent(path.substring(9)));
                    } else {
                        // user custom path
                        return path;
                    }
                }
            },
            onDrop: (drop) => {
                if (drop.type === "fileDropDropped") {
                    Object.values(dropListener).forEach(listener => listener(drop.paths));
                }
            },
            onMessage: (message: MessageToBackend) => {
                // console.log(message);
                if (message.type === "loaded") {
                    window.loaded = true;

                    updateWindow(nwv, props);

                    nwv.eval(applyMessage.toString())
                    nwv.eval(append.toString());
                    nwv.eval(update.toString());
                    nwv.eval(remove.toString());

                    window.loadingQueue.forEach(js => nwv.eval(js));
                    window.loadingQueue = [];

                } else if (message.type === "event") {
                    const listener = eventListener[message.id]?.[message.eventType];
                    if (listener) {
                        listener(message.value);
                    } else {
                        throw new Error("Called not set listener.");
                    }
                } else if (message.type === "message") {
                    console.log("Message:", message.message);
                } else {
                    throw message.error;
                }
            }
        },
    );

    const window = {
        loaded: false,
        loadingQueue: [],
        nwv,
        run: nwv.run.bind(nwv),
    };

    return window;
}

export function closeWindow(nwv: NativeWebView) {
    nwv.close();
}

export function updateWindow(nwv: NativeWebView, props: Omit<WindowProps, "children">) {
    for (const key in props) {
        const value = props[key];
        switch (key as keyof WindowProps) {
            case "title": nwv.setTitle(value); continue;
            case "width": nwv.set("innerSize", { width: value, height: props.height }); continue;
            case "height": nwv.set("innerSize", { width: props.width, height: value }); continue;
            case "icon": value && nwv.set("windowIcon", { path: value }); continue;
            case "resizable": nwv.set("resizable", { resizable: value }); continue;
            case "minSize": nwv.set("minInnerSize", value); continue;
            case "maxSize": nwv.set("maxInnerSize", value); continue;
            case "position": nwv.set("outerPosition", value); continue;
            case "alwaysOnTop": nwv.set("alwaysOnTop", { always: value }); continue;
            case "decorations": nwv.set("decorations", { decorations: value }); continue;
            case "fullscreen": nwv.set("fullscreen", { fullscreen: value }); continue;
            case "maximized": nwv.set("maximized", { maximized: value }); continue;
            case "minimized": nwv.set("minimized", { minimized: value }); continue;
            default: console.error(new Error(`Unknown window prop "${key}".`));
        }
    }
}

export function getFrontendProps(id: string, props: Props): FrontendProps {
    eventListener[id] = {};
    delete dropListener[id];

    const propsWithListeners: FrontendProps = {};

    for (const tag in props) {
        const tagLowerCase = tag.toLowerCase();

        const value = props[tag];
        if (tag.startsWith("on")) {
            if (tag === "onDropFiles") {
                dropListener[id] = value;
            } else {
                propsWithListeners[tagLowerCase] = tag;
                eventListener[id][tag] = value;
            }
        } else if (tag.startsWith("inner")) {
            propsWithListeners[tag] = value;
        } else {
            propsWithListeners[tagLowerCase] = value;
        }
    }

    return propsWithListeners;
}

export function appendElement(window: WindowType, parentId: string, id: string, tagName: Type, props: Props) {
    const message: MessageToFrontend = { type: "append", parentId, id, tagName, props: getFrontendProps(id, props) };
    const js = `applyMessage(${JSON.stringify(message)});`;
    if (window.loaded) {
        window.nwv.eval(js);
    } else {
        window.loadingQueue.push(js);
    }
}

export function updateElement(window: WindowType, id: string, props: Props) {
    const message: MessageToFrontend = { type: "update", id, props: getFrontendProps(id, props) };
    const js = `applyMessage(${JSON.stringify(message)});`;
    if (window.loaded) {
        window.nwv.eval(js);
    } else {
        window.loadingQueue.push(js);
    }
}

export function removeElement(window: WindowType, id: string) {
    const message: MessageToFrontend = { type: "remove", id };
    const js = `applyMessage(${JSON.stringify(message)});`;
    if (window.loaded) {
        window.nwv.eval(js);
    } else {
        window.loadingQueue.push(js);
    }
}

// ------------- WebView -------------
/** Implemented in native-webview */
function sendMessage(message: MessageToBackend) { }

function applyMessage(message: MessageToFrontend) {
    switch (message.type) {
        case "append": return append(message.parentId, message.id, message.tagName, message.props);
        case "update": return update(message.id, message.props);
        case "remove": return remove(message.id);
        default: throw new Error(`Unknown message type for frontend.`);
    }
}

function append(parentId: string, id: string, tagName: Type, props: FrontendProps) {
    const element = document.createElement(tagName);
    element.id = id;

    const parent = document.getElementById(parentId);
    if (!parent) throw new Error(`Element (parent) with id "${parentId}" doesn't exist.`);
    parent.append(element);

    update(id, props);
}

function update(id: string, props: FrontendProps) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element with id "${id}" doesn't exist and cannot be updated.`);

    for (const tag in props) {
        if (tag === "style") {
            const style = props[tag];
            for (const key in style) {
                const value = style[key];
                if (key === "animationKeyframes") {
                    // implement animation
                    const animationName = "react-bond-animation-" + id;
                    element.style.animationName = animationName;

                    let styleElement = document.getElementById(animationName);
                    if (!styleElement) {
                        styleElement = document.createElement("style");
                        styleElement.id = animationName;
                        element.appendChild(styleElement);
                    }

                    const styles = "@keyframes " + animationName + " {\n" + value + "\n)";
                    // @ts-ignore IE fix
                    if (styleElement.styleSheet) {
                        // @ts-ignore IE fix
                        styleElement.styleSheet.cssText = styles;
                    } else {
                        styleElement.innerHTML = styles;
                    }
                } else {
                    element.style[key] = value;
                }
            }
        } else if (tag.substring(0, 2) === "on") {
            element[tag] = (e) => sendMessage({
                type: "event",
                id,
                eventType: props[tag],
                value: tag === "onchange" ? { target: { value: e.target.value, checked: e.target.checked } } : e
            });
        } else {
            element[tag] = props[tag];
        }
    }
}

function remove(id: string) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element with id "${id}" doesn't exist and cannot be removed.`);

    if (element.parentElement) {
        element.parentElement.removeChild(element);
    } else {
        throw new Error(`Element with id "${id}" doesn't have parent and cannot be removed.`);
    }
}
