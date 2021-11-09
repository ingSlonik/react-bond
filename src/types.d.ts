import { ChildProcessWithoutNullStreams } from "child_process";

import { ReactChild } from "react";

type Type = "window" | "view" | "text";

export type Container = {
    port: number,
    windows: Instance[],
    append(parent: Instance, child: Instance): void,
    update(instance: Instance, newProps: Partial<Props>),
};

export type Instance = {
    windowId: string,
    id: null | string,
    type: Type,
    props: Props,
    parent: null | Instance,
    children: Instance[],
    process: null | ChildProcessWithoutNullStreams,
};

export type Style = { width: number | string, height: number | string };

export type Events = {
    onPress?: () => void,
};

export type Props = {
    window?: {
        title: string,
        width: number,
        height: number,    
    },
    style?: Style,
    events?: Events,
    text?: string,
    children?: ReactChild,
};

export type Child = {
    id: string,
    type: Type,
    props: ChildProps,
}

export type ChildProps = {
    style: Partial<Style>,
    text: null | string,
    events: string[],
};

export type MessageToFrontEnd = {
    type: "append",
    parentId: string,
    child: Child,
} | {
    type: "update",
    id: string,
    props: ChildProps,
};

export type MessageToBackend = {
    type: "message",
    message: string,
} | {
    type: "error",
    error: Error,
} | {
    type: "event",
    id: string,
    eventType: string,
    value: null | number | string,
};
