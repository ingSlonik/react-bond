# react-neutron

react-neutron is a framework for building cross-platform lightweight desktop apps with the React.

## Usage

```js
import React from "react";
import { render, Window, View, Text } from "react-neutron";

render(<Window title="Hello app" width={420} height={150}>
    <View style={{ flexGrow: 1, justifyContent: "center" }}>
        <Text style={{ color: "#888", fontSize: 32, textAlign: "center" }}>
            Hello, I am react-neutorn.
        </Text>
    </View>
</Window>);
```

## Run examples

Clone repository and...

```
$ npm run example -- example/hello.tsx
$ npm run example -- example/counter.tsx
$ npm run example -- example/calculator.tsx
$ npm run example -- example/images.tsx
$ npm run example -- example/inputs.tsx
$ npm run example -- example/file.tsx
$ npm run example -- example/multipleWindows.tsx
$ npm run example -- example/scroll.tsx
$ npm run example -- example/activityIndicator.tsx
```

## Features

### Basic components from react-native

All components works in all systems in the same way.
They has the same properties as in `react-native` library without system dependent properties.

- `ActivityIndicator`
- `Button`
- `Image`
- `Pressable`
- `ScrollView`
- `Text`
- `View`

### react-bond components

- `Window`
- `File`
- `Input`

### Animation

Powered by CSS3 animation defined inline just in `style` prop.

```js
<View style={{
    ...viewStyle,
    animationDuration: 2000,
    animationKeyframes: {
        0: { transform: [{ rotate: "0deg" }] },
        100: { transform: [{ rotate: "360deg" }] },
    },
}} />
```

## Background

This is running on `native-webview` of your system.

All program is running in node. That means you have full access to file system, notifications and other node packages.
