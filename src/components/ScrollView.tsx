import React, { Children, ReactNode } from "react";
import { getCSSProperties } from "../instance";

import { LayoutStyle, ViewStyle } from "../types";

export type ScrollViewProps = {
    style?: Partial<LayoutStyle & ViewStyle>,
    // StickyHeaderComponent
    // alwaysBounceHorizontal
    // alwaysBounceVertical
    // automaticallyAdjustContentInsets
    // automaticallyAdjustsScrollIndicatorInsets
    // bounces
    // bouncesZoom
    // canCancelContentTouches
    // centerContent
    /** The same as `style`, added only for react-native compatibility */
    contentContainerStyle?: Partial<LayoutStyle & ViewStyle>,
    // contentInset
    // contentInsetAdjustmentBehavior
    // contentOffset TODO: implement
    // decelerationRate - doesn't make sense for pc
    // directionalLockEnabled
    // disableIntervalMomentum TODO: implement
    // disableScrollViewPanResponder
    // endFillColor
    // fadingEdgeLength
    horizontal?: boolean,
    // indicatorStyle
    // invertStickyHeaders TODO: implement
    // keyboardDismissMode - not with keyboard
    // keyboardShouldPersistTaps - not with keyboard
    // maintainVisibleContentPosition
    // maximumZoomScale
    // minimumZoomScale
    // nestedScrollEnabled
    // onContentSizeChange TODO: implement handlers
    // onMomentumScrollBegin TODO: implement handlers
    // onMomentumScrollEnd TODO: implement handlers
    // onScroll TODO: implement handlers
    // onScrollBeginDrag TODO: implement handlers
    // onScrollEndDrag TODO: implement handlers
    // onScrollToTop
    // overScrollMode
    // pagingEnabled TODO: implement
    // persistentScrollbar
    // pinchGestureEnabled
    // refreshControl TODO: implement, priority 1
    // removeClippedSubviews - experimental
    scrollEnabled?: boolean,
    // scrollEventThrottle
    // scrollIndicatorInsets
    // scrollPerfTag
    // scrollToOverflowEnabled
    // scrollsToTop
    // showsHorizontalScrollIndicator TODO: implement
    // showsVerticalScrollIndicator TODO: implement
    // snapToAlignment
    // snapToEnd TODO: implement
    // snapToInterval TODO: implement
    // snapToOffsets TODO: implement
    // snapToStart TODO: implement
    // stickyHeaderHiddenOnScroll TODO: implement, priority 2
    // stickyHeaderIndices TODO: implement, priority 2
    // zoomScale
    children: ReactNode,
};

export function ScrollView({
    style,
    contentContainerStyle,
    horizontal = false,
    scrollEnabled = true,
    children
}: ScrollViewProps): JSX.Element {
    const cssProperties = getCSSProperties({ ...contentContainerStyle, ...style });

    return <div style={{
        flexGrow: 1,
        flexBasis: "16px",
        flexDirection: horizontal ? "row" : "column",
        overflowX: scrollEnabled && horizontal ? "scroll" : "hidden",
        overflowY: !scrollEnabled || horizontal ? "hidden" : "scroll",
        ...cssProperties
    }}>
        {children}
    </div>;
}