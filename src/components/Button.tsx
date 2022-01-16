import React from "react";
import { Pressable } from "./Pressable";
import { Text } from "./Text";

export type ButtonProps = {
    title: string,
    onPress: () => void,
    // accessibilityLabel
    // accessibilityActions
    // onAccessibilityAction
    color?: string,
    disabled?: boolean,
    // hasTVPreferredFocus
    // nextFocusDown
    // nextFocusForward
    // nextFocusLeft
    // nextFocusRight
    // nextFocusUp
    // testID
    // touchSoundDisabled
};

export function Button({ onPress, title, color = "#F1F1F1", disabled = false }: ButtonProps): JSX.Element {
    return <Pressable
        style={{
            borderRadius: 4,
            borderColor: "#888888",
            borderWidth: 1,
            borderStyle: "solid",
            paddingBottom: 4,
            paddingTop: 4,
            paddingLeft: 16,
            paddingRight: 16,
            backgroundColor: color,
            opacity: disabled ? 0.6 : 1,
        }}
        onPress={disabled ? () => { } : onPress}
    >
        <Text style={{ textAlign: "center" }}>{title}</Text>
    </Pressable>;
}