import React from "react";
import { View } from "./View";
import { Pressable } from "./Pressable";

const transitionDuration = 500;

export type SwitchProps = {
    disabled?: boolean,
    onChange?: (value: boolean) => void,
    onValueChange?: (value: boolean) => void,
    thumbColor?: { false: string, true: string },
    trackColor?: string,
    value: boolean,
};

export function Switch({
    disabled = false,
    onChange,
    onValueChange,
    thumbColor = { false: "#AAA", true: "#0F0" },
    trackColor = "#FFF",
    value,
}: SwitchProps): JSX.Element {
    return <Pressable
        onPress={() => {
            onChange && onChange(!value);
            onValueChange && onValueChange(!value);
        }}
        style={{
            width: 48,
            height: 24,
            backgroundColor: value ? thumbColor.true : thumbColor.false,
            borderRadius: 12,
            transitionDuration,
        }}
    >
        <View style={{
            position: "absolute",
            top: 2,
            left: value ? 25 : 2,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: trackColor,
            transitionDuration,
        }} />
    </Pressable>
}