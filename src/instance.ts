import { appendElement, getWindow, removeElement, updateElement, updateWindow } from "./components/Window";

import { Instance, WindowInstance, Type, Props, WindowProps, Container } from "./types";

export function createWindowInstance(type: "window", props: WindowProps, rootContainer: Container, onStateEnd: () => void): WindowInstance {
    const window = getWindow(props);

    const windowInstance: WindowInstance = {
        id: "root",
        type,
        props,
        window,
        parent: null,
        children: [],
    };

    window.run().then(() => {
        // TODO: remove children windows
        removeWindowToContainer(rootContainer, windowInstance, onStateEnd);
    });

    return windowInstance;
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

export function appendWindowToContainer(container: Container, windowInstance: WindowInstance) {
    container.state = "running";
    container.windows.push(windowInstance);
}

export function removeWindowToContainer(container: Container, windowInstance: WindowInstance, onStateEnd: () => void) {
    const index = container.windows.indexOf(windowInstance);
    if (index < 0) throw new Error("Window cannot be removed from container, because it is not there.");
    container.windows.splice(index, 1);

    if (container.windows.length < 1) {
        // End render
        container.state = "end";
        onStateEnd();
    }
}

export function appendInitial(parent: Instance, child: Instance) {
    child.parent = parent;
    parent.children.push(child);
}

export function finalizeInitialChildren(instance: Instance): boolean {
    const { id, children } = instance;
    if (id) {
        let finalize = false;
        children.forEach((child, i) => {
            if (child.id === null) {
                // render whole tree with ids
                finalize = true;
                // TODO: check if exists
                child.id = `${id}-${i}`;
                child.parent = instance;

                appendInstance(child);
                finalizeInitialChildren(child);
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
        updateWindow(instance.window.nwv, newProps as WindowProps);
    } else {
        const window = getWindowInstance(instance);
        const id = instance.id;

        if (!id) throw new Error("Appended instance doesn't have id.");

        updateElement(window.window, id, newProps);
    }
}

export function removeInstance(parentInstance: Instance, child: Instance) {
    const childIndex = parentInstance.children.indexOf(child);

    if (childIndex < 0) throw new Error("The parent not include the child for remove.");

    const window = getWindowInstance(child);
    const id = child.id;

    if (!id) throw new Error("Removed instance doesn't have id.");

    removeElement(window.window, id);
    parentInstance.children.splice(childIndex, 1);
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
