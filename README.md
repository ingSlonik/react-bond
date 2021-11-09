# react-neutron

react-neutron is a framework for building cross-platform lightweight desktop apps with the React.

## Background

This is running on native `webview` of your system.

All program is running in node. That means you have full access to file system, notifications and other node packages.

## Usage

```js
import React from "react";
import { render, Window, View, Text } from "react-neutron";

render(<Window title="Desktop app" width={1024} height={768}>
    <Text style={{ color: "#888", fontSize: 64 }}>Welcome</Text>
<Window>);
```

## Run examples

Clone repository and...

```
$ npm run example -- example/window.tsx
```

### TODO

Now it is running in [webview](https://www.npmjs.com/package/webview) through the http server.
The plan is use [this webview](https://github.com/webview/webview) and call compiled function in C language.
