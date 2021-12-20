import React from "react";

export type WindowProps = {
    title: string,
    width: number,
    height: number,
    children: JSX.Element,
};

export function Window({ children, ...props }: WindowProps): JSX.Element {
    // @ts-ignore
    return <window window={props}>{children}</window>;
}
