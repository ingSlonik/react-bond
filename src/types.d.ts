import { CSSProperties, ReactNode } from "react";
import { WindowProps as WindowPropsComponent, WindowType as Window } from "./components/Window";

type Type = "window" | "div" | "span" | "img" | "input" | "textarea" | "svg"; // ,...

export type Container = {
    state: "init" | "running" | "end",
    windows: WindowInstance[],
};

export type WindowInstance = {
    id: "root",
    type: "window",
    props: WindowProps,
    window: Window,
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

// part of on https://reactnative.dev/docs/layout-props
export type SizeProps = {
    /** number as pixel, string ends with % */
    width: number | string,
    /** number as pixel, string ends with % */
    height: number | string,
    maxHeight: number,
    maxWidth: number,
    minHeight: number,
    minWidth: number,
};

// based on https://reactnative.dev/docs/layout-props
export type LayoutStyle = SizeProps & {
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

    transform: TransformStyle,
};

export type TransformStyle = Array<
    | { matrix: [number, number, number, number, number, number] }
    | { perspective: number }
    | { rotate: string }
    | { rotateX: string }
    | { rotateY: string }
    | { rotateZ: string }
    | { scale: number }
    | { scaleX: number }
    | { scaleY: number }
    | { translateX: number }
    | { translateY: number }
    | { skewX: number }
    | { skewY: number }
>;

export type TransitionsStyle = {
    transitionProperty: string,
    transitionDuration: number, // ms
    transitionTimingFunction: TimingFunction,
    transitionDelay: number, // ms
};

type TimingFunction = "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear" | "step-start" | "step-end";

export type AnimationStyle<T> = {
    animationDuration: number, // ms
    animationTimingFunction: TimingFunction,
    animationDelay: number, // ms
    animationIterationCount: number | "infinite",
    animationDirection: "normal" | "reverse" | "alternate" | "alternate-reverse",
    animationFillMode: "none" | "forwards" | "backwards" | "both",
    animationPlayState: "running" | "paused",

    animationKeyframes: { [percent: number]: Partial<T> },
};

export type Style = TextStyle & ViewStyle;

export type WindowProps = Omit<WindowPropsComponent, "children">;


export type Props = {
    style?: CSSProperties,
    onClick?: () => void,
    onChange?: (event: { target: { value: string, checked: boolean } }) => void,
    // will be called when user drop files to window
    onDropFiles?: (paths: string[]) => void,
    innerText?: string,
};

export type RenderProps = Props & { children: ReactNode };
