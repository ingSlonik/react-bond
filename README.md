# react-bond

`react-bond` is a library for building cross-platform lightweight desktop apps with the React.

## Usage

```js
import React from "react";
import { render, Window, View, Text } from "react-bond";

render(<Window title="Hello app" width={420} height={150}>
    <View style={{ flexGrow: 1, justifyContent: "center" }}>
        <Text style={{ color: "#888", fontSize: 32, textAlign: "center" }}>
            Hello, I am react-bond.
        </Text>
    </View>
</Window>);
```

## Features

- [x] Run application without any compilation or other native dependencies. 
  - Library contains compiled code for all systems.
- [x] Multiple windows.
- [x] File drop component.
- [x] Implementation all basic `react-native` components.
- [x] Animations.
- [x] Hot reloading.
- [ ] Building application for all systems anywhere.

### Basic components from react-native

All components works in all systems in the same way.
They has the same properties as in `react-native` library without system dependent properties.

- `ActivityIndicator`
- `Button`
- `Image`
- `Pressable`
- `ScrollView`
- `Text`
- `TextInput`
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

### Hot reloading

package.json
```json
{
    "scripts": {
        "start": "react-bond-hot src/index.tsx"
    }
}
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
$ npm run example -- example/hotReload.tsx
```

## Background

This is running on `native-webview` of your system.

All program is running in node. That means you have full access to file system, notifications and other node packages.
