import React, { useState } from "react";
import { render, Window, View, Text, Button } from "../src";

function App() {
    const [ count, setCount ] = useState(0);

    return <Window title="Counter app" width={420} height={250}>
        <View style={{ flexGrow: 1, justifyContent: "space-around", alignItems: "center" }}>
            <Text style={{ color: "#888", fontSize: 32 }}>Click counter</Text>

            <Button onPress={() => setCount(c => c + 1)} title="Click here" />

            <Text>{`You clicked ${count} times.`}</Text>
        </View>
    </Window>;
}

render(<App />);
