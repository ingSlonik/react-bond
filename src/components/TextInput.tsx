import React from "react";
import { Input } from "./Input";

import { TextStyle, LayoutStyle } from "../types";

export type TextInputProps = {
    // allowFontScaling TODO: implement
    // autoCapitalize TODO: implement
    // autoComplete
    // autoCorrect TODO: implement?
    // autoFocus TODO: implement
    // blurOnSubmit TODO: implement
    // caretHidden TODO: implement
    // clearButtonMode
    // clearTextOnFocus
    // contextMenuHidden TODO: implement
    // dataDetectorTypes
    defaultValue?: string,
    // disableFullscreenUI
    editable?: boolean,
    // enablesReturnKeyAutomatically
    // importantForAutofill
    // inlineImageLeft
    // inlineImagePadding
    // inputAccessoryViewID
    // keyboardAppearance
    // keyboardType TODO: implement
    // maxFontSizeMultiplier TODO: implement
    maxLength?: number,
    multiline?: boolean,
    // numberOfLines
    // onBlur TODO: implement
    onChange?: (nativeEvent: { nativeEvent: { eventCount: number, target: { value: string }, text: string } }) => void,
    onChangeText?: (text: string) => void,
    // onContentSizeChange TODO: implement
    // onEndEditing TODO: implement
    // onPressIn TODO: implement
    // onPressOut TODO: implement
    // onFocus TODO: implement
    // onKeyPress TODO: implement
    // onLayout TODO: implement
    // onScroll TODO: implement
    // onSelectionChange TODO: implement
    // onSubmitEditing TODO: implement
    // placeholder?: string, TODO: implement
    // placeholderTextColor?: string, TODO: implement
    // returnKeyLabel
    // returnKeyType TODO: implement
    // rejectResponderTermination
    // scrollEnabled
    // secureTextEntry TODO: implement
    // selection TODO: implement
    // selectionColor TODO: implement
    // selectTextOnFocus TODO: implement
    // showSoftInputOnFocus TODO: implement
    // spellCheck
    textAlign?: "left" | "center" | "right",
    // textContentType
    // passwordRules
    style: Partial<TextStyle & LayoutStyle>,
    // textBreakStrategy
    // underlineColorAndroid
    value?: string,
};

export function TextInput({
    defaultValue = "",
    editable = true,
    maxLength,
    multiline = false,
    onChange,
    onChangeText,
    // placeholder = "",
    // placeholderTextColor = "#888",
    textAlign = "left",
    style,
    value,
}: TextInputProps): JSX.Element {
    return <Input.Text
        style={{ textAlign, ...style }}
        multiline={multiline}
        value={value || defaultValue}
        maxLength={maxLength}
        disable={!editable}
        onChange={text => {
            if (onChange) onChange({ nativeEvent: { eventCount: 1, target: { value: text }, text } });
            if (onChangeText) onChangeText(text);
        }}
    />;
}