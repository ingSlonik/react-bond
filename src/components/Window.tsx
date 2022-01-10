import React from "react";
import NativeWebView from "native-webview";
import { resolve } from "path";
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
    children: JSX.Element,
};

export function Window({ children, icon = null, ...props }: WindowProps): JSX.Element {
    // @ts-ignore
    return <window icon={icon} {...props}>{children}</window>;
}

// ------------ Backend -------------

export type MessageToFrontend =
    | { type: "append", parentId: string, id: string, tagName: Type, props: Props }
    | { type: "update", id: string, props: Props }
    | { type: "remove", id: string };

export type MessageToBackend =
    | { type: "loaded" }
    | { type: "message", message: string }
    | { type: "error", error: Error }
    | { type: "event", id: string, eventType: string, value: null | number | string };

const eventListener: { [id: string]: { [eventType: string]: (value: null | number | string) => void } } = {};

export type WindowType = {
    loaded: boolean,
    loadingQueue: string[],
    nwv: NativeWebView,
    run: () => Promise<void>,
};

export function getWindow(
    props: Omit<WindowProps, "children">,
    getPath: (src: string) => string,
    onMessage: (message: string) => void
): WindowType {
    const nwv = new NativeWebView(
        { title: props.title, innerSize: { width: props.width, height: props.height } },
        nwvPath => {
            const src = nwvPath.replace("nwv://", "");
            if (nwvPath === "nwv://index.html") {
                return resolve(__dirname, "..", "..", "webview", src);
            } else {
                return getPath(src);
            }
        },
        (message: MessageToBackend) => {
            // console.log(message);
            if (message.type === "loaded") {
                window.loaded = true;

                updateWindow(nwv, props);

                nwv.eval(applyMessage.toString())
                nwv.eval(append.toString());
                nwv.eval(update.toString());
                nwv.eval(remove.toString());

                window.loadingQueue.forEach(js => nwv.eval(js));

            } else if (message.type === "event") {
                const listener = eventListener[message.id]?.[message.eventType];
                if (listener) {
                    listener(message.value);
                } else {
                    throw new Error("Called not set listener.");
                }
            } else if (message.type === "message") {
                onMessage(message.message);
            } else {
                throw message.error;
            }
        }
    );

    const window = {
        loaded: false,
        loadingQueue: [],
        nwv,
        run: nwv.run.bind(nwv),
    };

    return window;
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
            case "alwaysOnTop": nwv.set("alwaysOnTop", { always: value });
            case "decorations": nwv.set("decorations", { decorations: value });
            case "fullscreen": nwv.set("fullscreen", { fullscreen: value });
            case "maximized": nwv.set("maximized", { maximized: value });
            case "minimized": nwv.set("minimized", { minimized: value });
        }
    }
}

export function getPropsWithListeners(id: string, props: Props): Props {
    eventListener[id] = {};

    const propsWithListeners: Props = {};

    for (const tag in props) {
        if (tag.startsWith("on")) {
            propsWithListeners[tag.toLocaleLowerCase()] = tag;
            eventListener[id][tag] = props[tag];
        } else {
            propsWithListeners[tag] = props[tag];
        }
    }

    return propsWithListeners;
}

export function appendElement(window: WindowType, parentId: string, id: string, tagName: Type, props: Props) {
    const message: MessageToFrontend = { type: "append", parentId, id, tagName, props: getPropsWithListeners(id, props) };
    const js = `applyMessage(${JSON.stringify(message)});`;
    if (window.loaded) {
        window.nwv.eval(js);
    } else {
        window.loadingQueue.push(js);
    }
}

export function updateElement(window: WindowType, id: string, props: Props) {
    const message: MessageToFrontend = { type: "update", id, props: getPropsWithListeners(id, props) };
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
function sendMessage(message: MessageToBackend) { }

function applyMessage(message: MessageToFrontend) {
    switch (message.type) {
        case "append": return append(message.parentId, message.id, message.tagName, message.props);
        case "update": return update(message.id, message.props);
        case "remove": return remove(message.id);
        default: throw new Error(`Unknown message type for frontend.`);
    }
}

function append(parentId: string, id: string, tagName: Type, props: Props) {
    const element = document.createElement(tagName);
    element.id = id;

    const parent = document.getElementById(parentId);
    if (!parent) throw new Error(`Element (parent) with id "${parentId}" doesn't exist.`);
    parent.append(element);

    update(id, props);
}

function update(id: string, props: Props) {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element with id "${id}" doesn't exist and cannot be updated.`);

    for (const tag in props) {
        if (tag === "style") {
            const style = props[tag];
            for (const key in style) {
                element.style[key] = style[key];
            }
        } else if (tag.substring(0, 2) === "on") {
            element[tag] = (e) => sendMessage({ type: "event", id, eventType: props[tag], value: JSON.stringify(e) });
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
