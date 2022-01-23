import React, { useState } from "react";
import { Window, View, Text, Button } from "../src";

export function App() {
    const [number, setNumber] = useState(0);

    return <Window title="Hot app" width={420} height={150}>
        <View style={{ flexGrow: 1, justifyContent: "center" }}>
            <Text style={{ color: "#888", fontSize: 32, textAlign: "center" }}>
                Hello, I am react-neutorn.
            </Text>
            <Text style={{ color: "#888", fontSize: 21, textAlign: "center" }}>
                Change me and see the magic.
            </Text>
            <Text>State is: {number}</Text>
            <Button title="Add number" onPress={() => setNumber(n => n + 1)} />
        </View>
    </Window>;
}
