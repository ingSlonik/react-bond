import ReactReconciler from "react-reconciler";

import { appendInitial, createInstance, createWindowInstance, finalizeInitialChildren, updateInstance } from "./instance";
import { createContainer } from "./container";

import { Type, Container, Instance, RenderProps, Props, WindowProps } from "./types";

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
            return createWindowInstance(type, props as WindowProps, rootContainer);
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
    cancelTimeout(id) {
        clearTimeout(id);
    },
    finalizeInitialChildren(instance, type, props, rootContainer, hostContext) {
        return finalizeInitialChildren(instance, rootContainer);
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
        return {};
    },
    preparePortalMount(containerInfo) { },
    prepareUpdate(instance, type, oldProps, newProps, rootContainer, hostContext) {
        // TODO: performance...
        const { children, ...updatePayload } = newProps;
        return updatePayload;
    },
    resetAfterCommit(containerInfo) { },
    scheduleTimeout(fn, delay) {
        return setTimeout(fn, delay);
    },
    shouldSetTextContent(type, props) {
        return false;
    },
    clearContainer(container) { },
    appendChildToContainer(container, child) {
        if (child.type === "window") {
            container.windows.push(child);
        } else {
            throw new Error("You cannot add elements outside of window.")
        }
    },
    commitMount(instance, type, props, internalInstanceHandle) {
        // console.log("commit", instance.children);
    },
    // is is done in prepare update (I need Container for that)
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
});

export function render(children: JSX.Element) {
    const container = reconciler.createContainer(createContainer(), 0, false, null);
    reconciler.updateContainer(children, container, null, null);
}
