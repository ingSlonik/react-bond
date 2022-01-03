import NativeWebView from "native-webview";

import { CSSProperties, ReactChild } from "react";
import { WindowProps as WindowPropsComponent } from "./components/Window";

type Type = "window" | "div" | "span" | "svg"; // ,...

export type Container = {
    status: "starting" | "run",
    windows: Instance[],
    // append(parent: Instance, child: Instance): void,
    // update(instance: Instance, newProps: Partial<Props>),
};

export type WindowInstance = {
    id: "root",
    type: "window",
    props: WindowProps,
    webView: NativeWebView,
    parent: null | Instance,
    children: Instance[],
};

export type Instance = WindowInstance | {
    // windowId: string,
    id: null | string,
    type: Exclude<Type, "window">,
    props: Props,
    parent: null | Instance,
    children: Instance[],
};

type Color = string;

// based on https://reactnative.dev/docs/layout-props
export type LayoutStyle = {
    alignContent: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around',
    alignItems: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline',
    alignSelf: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline',
    aspectRatio: number,
    borderBottomWidth: number,
    borderEndWidth: number,
    borderLeftWidth: number,
    borderRightWidth: number,
    borderStartWidth: number,
    borderTopWidth: number,
    borderWidth: number,
    bottom: number,
    direction: 'inherit' | 'ltr' | 'rtl',
    display: 'none' | 'flex',
    // end
    flex: number,
    flexBasis: number,
    flexDirection: 'row' | 'row-reverse' | 'column' | 'column-reverse',
    flexGrow: number,
    flexShrink: number,
    flexWrap: 'wrap' | 'nowrap' | 'wrap-reverse',
    height: number,
    justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly',
    left: number,
    margin: number,
    marginBottom: number,
    // marginEnd
    // marginHorizontal
    marginLeft: number,
    marginRight: number,
    // marginStart
    marginTop: number,
    // marginVertical
    maxHeight: number,
    maxWidth: number,
    minHeight: number,
    minWidth: number,
    overflow: 'visible' | 'hidden' | 'scroll',
    padding: number,
    paddingBottom: number,
    // paddingEnd
    // paddingHorizontal
    paddingLeft: number,
    paddingRight: number,
    // paddingStart
    paddingTop: number,
    // paddingVertical
    position: 'absolute' | 'relative',
    right: number,
    // start
    top: number,
    width: number,
    zIndex: number,
};

// based on https://reactnative.dev/docs/text-style-props
export type TextStyle = {
    color: string,
    fontFamily: string,
    fontSize: number,
    fontStyle: 'normal' | 'italic',
    fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
    // includeFontPadding
    // fontVariant
    letterSpacing: number,
    lineHeight: number,
    textAlign: 'auto' | 'left' | 'right' | 'center' | 'justify',
    // textAlignVertical
    // textDecorationColor
    textDecorationLine: 'none' | 'underline' | 'line-through' | 'underline line-through',
    // textDecorationStyle
    // textShadowColor,
    // textShadowOffset, 
    // textShadowRadius
    textShadow: string,
    textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize',
    // writingDirection
};

// based on https://reactnative.dev/docs/view-style-props
export type ViewStyle = {
    backfaceVisibility: 'visible' | 'hidden',
    backgroundColor: Color,
    borderBottomColor: Color,
    borderBottomEndRadius: number,
    borderBottomLeftRadius: number,
    borderBottomRightRadius: number,
    borderBottomStartRadius: number,
    borderBottomWidth: number,
    borderColor: Color,
    borderEndColor: Color,
    borderLeftColor: Color,
    borderLeftWidth: number,
    borderRadius: number,
    borderRightColor: Color,
    borderRightWidth: number,
    borderStartColor: Color,
    borderStyle: 'solid' | 'dotted' | 'dashed',
    borderTopColor: Color,
    borderTopEndRadius: number,
    borderTopLeftRadius: number,
    borderTopRightRadius: number,
    borderTopStartRadius: number,
    borderTopWidth: number,
    borderWidth: number,
    // elevation
    opacity: number,
};

export type Style = TextStyle & ViewStyle;

export type Events = {
    onPress?: () => void,
};

export type WindowProps = Omit<WindowPropsComponent, "children">;

export type Props = {
    style?: CSSProperties,
    onClick?: () => void,
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
