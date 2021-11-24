import ReactReconciler from "react-reconciler";

import { appendInitial, createInstance, finalizeInitialChildren, updateInstance } from "./instance";
import { createContainer } from "./container";

import { Type, Container, Instance, Props } from "./types";

type TextInstance = Instance;
type SuspenseInstance = Instance;
type HydratableInstance = Instance;
type PublicInstance = Instance;
type HostContext = null | string; // window ID
type UpdatePayload = Partial<Props>;
type ChildSet = null;
type TimeoutHandle = NodeJS.Timeout;
type NoTimeout = -1;

const reconciler = ReactReconciler<
    Type,
    Props,
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
    createInstance(type, props, rootContainer, hostContext, internalHandle) {
        if (hostContext === null && type !== "window") throw new Error("Create element without window?");
        return createInstance(type, props, rootContainer, hostContext || "window");
    },
    createTextInstance(text, rootContainer, hostContext, internalHandle) {
        if (hostContext === null) throw new Error("Create element without window?");
        return createInstance("text", { text }, rootContainer, hostContext);
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
        return null;
    },
    getChildHostContext(parentHostContext, type, rootContainer) {
        if (type === "window") {
            // TODO: check duplication
            return `window${rootContainer.windows.length}`;
        } else {
            return parentHostContext;
        }
    },
    getPublicInstance(instance) {
        return instance;
    },
    prepareForCommit(containerInfo) {
        return {};
    },
    preparePortalMount(containerInfo) {},
    prepareUpdate(instance, type, oldProps, newProps, rootContainer, hostContext) {
        // TODO: performance...
        const { children, ...updatePayload } = newProps;
        updateInstance(instance, updatePayload, rootContainer);
        return updatePayload;
    },
    resetAfterCommit(containerInfo) {},
    scheduleTimeout(fn, delay) {
        return setTimeout(fn, delay);
    },
    shouldSetTextContent(type, props) {
        return type === "text";
    },
    clearContainer(container) {},
    appendChildToContainer(container, child) {
        if (child.type === "window") {
            container.windows.push(child);
        } else {
            throw new Error("You cannot add elements outside of window.")
        }
    },
    commitMount(instance, type, props, internalInstanceHandle) {},
    // is is done in prepare update (I need Container for that)
    commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork) {},
});

export function render(children: JSX.Element) {
    createContainer().then(newContainer => {
        const container = reconciler.createContainer(newContainer, 0, false, null); 
        reconciler.updateContainer(children, container, null, null);
    });
}
