import React from "react";
import { render, Window, View, ActivityIndicator } from "../src";

render(<Window title="ActivityIndicator example" width={420} height={150}>
    <View style={{ flexDirection: "row", flexGrow: 1, justifyContent: "space-around", alignItems: "center" }}>
        <ActivityIndicator />
        <ActivityIndicator size="large" />
        <ActivityIndicator size="small" color="#0000ff" />
        <ActivityIndicator size="large" color="#00ff00" />
    </View>
</Window>);