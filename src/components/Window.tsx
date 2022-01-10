import React from "react";
import NativeWebView from "native-webview";
import { resolve } from "path";
import { Type, Props } from "../types";

// ------------ Component -------------

export type WindowProps = {
    title: string,
    icon: null | string,
    width: number,
    height: number,
    children: JSX.Element,
};

Window.defaultProps = {
    icon: null,
};

export function Window({ children, ...props }: WindowProps): JSX.Element {
    // @ts-ignore
    return <window {...props}>{children}</window>;
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
    { title, icon, width, height }: Omit<WindowProps, "children">,
    getPath: (src: string) => string,
    onMessage: (message: string) => void
): WindowType {
    const nwv = new NativeWebView(
        { title, innerSize: { width, height } },
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

    if (icon)
        nwv.set("windowIcon", { path: resolve(icon) });

    const window = {
        loaded: false,
        loadingQueue: [],
        nwv,
        run: nwv.run.bind(nwv),
    };

    return window;
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
