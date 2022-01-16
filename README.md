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
```

## Background

This is running on `native-webview` of your system.

All program is running in node. That means you have full access to file system, notifications and other node packages.
