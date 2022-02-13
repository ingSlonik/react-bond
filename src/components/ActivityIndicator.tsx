
import React, { useEffect, useState } from "react";
import { View } from "./View";

export type ActivityIndicatorProps = {
    animating?: boolean,
    color?: string,
    // hidesWhenStopped
    size?: "small" | "large",
};

export function ActivityIndicator({ animating = true, color = "#888", size = "small" }: ActivityIndicatorProps): JSX.Element {
    const small = size === "small";

    return <View style={{
        borderStyle: "solid",
        borderWidth: small ? 4 : 8,
        borderColor: "#F1F1F1",
        borderTopColor: color,
        borderRadius: small ? 16 : 32,
        width: small ? 32 : 64,
        height: small ? 32 : 64,

        animationDuration: 2000,
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        animationPlayState: animating ? "running" : "paused",
        animationKeyframes: {
            0: { transform: [{ rotate: "0deg" }] },
            100: { transform: [{ rotate: "360deg" }] },
        },
    }} />;
}
