import { ReactNode } from "react";
import ReactReconciler, { OpaqueRoot } from "react-reconciler";

import { appendInitial, appendWindowToContainer, createInstance, createWindowInstance, finalizeInitialChildren, removeInstance, updateInstance } from "./instance";
import { createContainer } from "./container";

import { Type, Container, Instance, RenderProps, Props, WindowProps } from "./types";
import { closeWindow } from "./components/Window";

type TextInstance = Instance;
type SuspenseInstance = Instance;
type HydratableInstance = Instance;
type PublicInstance = Instance;
type HostContext = "container" | "window" | "svg";
type UpdatePayload = Partial<Props>;
type ChildSet = null;
type TimeoutHandle = NodeJS.Timeout;
type NoTimeout = -1;

const reconciler = ReactReconciler<
    Type,
    RenderProps,
    Container,
    Instance,
    TextInstance,
    SuspenseInstance,
    HydratableInstance,
    PublicInstance,
    HostContext,
    UpdatePayload,
    ChildSet,
    TimeoutHandle,
    NoTimeout
>({
    supportsMutation: true,
    supportsPersistence: false,
    supportsHydration: false,
    isPrimaryRenderer: true,
    noTimeout: -1,
    now() {
        return new Date().getTime();
    },
    createInstance(type, { children, ...props }, rootContainer, hostContext, internalHandle) {
        if (type === "window") {
            return createWindowInstance(type, props as WindowProps, rootContainer, onStateEnd);
        } else {
            if (hostContext === "container") {
                throw new Error("Create element without window?");
            } else {
                return createInstance(type, props, rootContainer);
            }
        }
    },
    createTextInstance(text, rootContainer, hostContext, internalHandle) {
        if (hostContext === null) throw new Error("Create element without window?");
        return createInstance("span", { innerText: text }, rootContainer);
    },
    appendInitialChild(parentInstance, childInstance) {
        appendInitial(parentInstance, childInstance);
    },
    appendChild(parentInstance, child) {
        appendInitial(parentInstance, child);
        finalizeInitialChildren(parentInstance);
    },
    cancelTimeout(id) {
        clearTimeout(id);
    },
    finalizeInitialChildren(instance, type, props, rootContainer, hostContext) {
        return finalizeInitialChildren(instance);
    },
    getRootHostContext(rootContainer) {
        return "container";
    },
    getChildHostContext(parentHostContext, type, rootContainer) {
        switch (type) {
            case "window": return "window";
            case "svg": return "svg";
            default: return parentHostContext;
        }
    },
    getPublicInstance(instance) {
        return instance;
    },
    prepareForCommit(containerInfo) {
        return null;
    },
    preparePortalMount(containerInfo) { },
    prepareUpdate(instance, type, oldProps, newProps, rootContainer, hostContext) {
        // TODO: performance...
        const updatePayload = {};
        for (const key in newProps) {
            if (key !== "children" && newProps[key] !== oldProps[key]) updatePayload[key] = newProps[key];
        }
        return updatePayload;
    },
    resetAfterCommit(containerInfo) { },
    resetTextContent(instance) { },
    scheduleTimeout(fn, delay) {
        return setTimeout(fn, delay);
    },
    shouldSetTextContent(type, props) {
        return false;
    },
    clearContainer(container) { },
    appendChildToContainer(container, child) {
        if (child.type === "window") {
            appendWindowToContainer(container, child);
        } else {
            throw new Error("You cannot add elements outside of window.")
        }
    },
    commitMount(instance, type, props, internalInstanceHandle) {
        // console.log("commit", instance.children);
    },
    commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork) {
        updateInstance(instance, updatePayload);
    },
    commitTextUpdate(textInstance, oldText, newText) {
        if (textInstance.type === "window") {
            throw new Error("Text instance cannot be windows.");
        } else {
            if (oldText !== newText) {
                updateInstance(textInstance, { innerText: newText });
            }
        }
    },
    removeChild(parentInstance, child) {
        removeInstance(parentInstance, child);
    },
    removeChildFromContainer(container, child) {
        // TODO: remove window
    },
    insertBefore(parentInstance, child, beforeChild) { },
});

// only for hot reload
let renderContainer: null | Container = null;
let isReloading = false;

export function render(children: ReactNode): OpaqueRoot {
    const container = createContainer();
    const opaqueRoot = reconciler.createContainer(container, 0, false, null);
    reconciler.updateContainer(children, opaqueRoot, null, null);

    if (global._reactBondHotReload === true) {
        if (renderContainer !== null) {
            isReloading = true;
            exitRender(renderContainer);
        }
        renderContainer = container;
    }

    return opaqueRoot;
}

export function exitRender(container: Container) {
    container.windows.forEach(win => closeWindow(win.window.nwv));
}

export function getContainerFromRender(render: OpaqueRoot): Container {
    return render.containerInfo();
}

export function onStateEnd() {
    if (global._reactBondHotReload === true) {
        if (isReloading) {
            isReloading = false;
        } else {
            global._reactBondUnwatchFiles();
        }
    }
}