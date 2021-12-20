import React from "react";
import { render, Window, View, Text } from "../src";

render(<Window title="Hello app" width={420} height={150}>
    <View style={{ flexGrow: 1, justifyContent: "center" }}>
        <Text style={{ color: "#888", fontSize: 32, textAlign: "center" }}>
            Hello, I am react-neutorn.
        </Text>
    </View>
</Window>);