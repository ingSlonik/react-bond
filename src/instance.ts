import { ChildProcessWithoutNullStreams } from "child_process";
import webview from "webview";

import { Instance, Type, Props, Container } from "./types";

export function createInstance(type: Type, props: Props, rootContainer: Container, windowId: string): Instance {
    if (type === "window") {
        const { title, width, height } = props.window!;

        const process: ChildProcessWithoutNullStreams = webview.spawn({
            title,
            width,
            height,
            url: `http://localhost:${rootContainer.port}/`,
        });

        return {
            id: "root",
            windowId,
            type,
            props,
            parent: null,
            children: [],
            process,
        };
    } else {
        return {
            id: null,
            windowId,
            type,
            props,
            parent: null,
            children: [],
            process: null,
        };
    }
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

                // @ts-ignore
                rootContainer.append(instance, child);
                finalizeInitialChildren(child, rootContainer);
            }
        });
        return finalize;
    } else {
        return false;
    }
}

export function updateInstance(instance: Instance, newProps: Partial<Props>, rootContainer: Container) {
    if (instance.type === "window")
        return;
        // throw new Error("In this version react-neutron is not allowed change props of window.");

    rootContainer.update(instance, newProps);
}