import React, { useState } from "react";
import { render, Window, View, Text, Pressable } from "../src";

function App() {
    const [ count, setCount ] = useState(0);

    return <Window title="Desktop app" width={800} height={600}>
        <View style={{ textAlign: "center" }}>
            <Text style={{ color: "#888", fontSize: "64px" }}>Welcome</Text>

            <Pressable onPress={() => setCount(c => c + 1)}>
                <View>
                    <Text>Click here</Text>
                </View>
            </Pressable>

            <Text>{`You clicked ${count} times.`}</Text>
        </View>
    </Window>;
}

render(<App />);
