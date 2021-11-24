import React, { useState } from "react";
import { render, Window, View, Text, Pressable } from "../src";

function App() {
    const [ count, setCount ] = useState(0);

    return <Window title="Desktop app" width={800} height={600}>
        <View>
            <Text style={{ color: "#888", fontSize: 64, textAlign: "center" }}>Welcome</Text>

            <Pressable style={{ margin: 32 }} onPress={() => setCount(c => c + 1)}>
                <Text style={{ textAlign: "center" }}>Click here</Text>
            </Pressable>

            <Text style={{ textAlign: "center" }}>{`You clicked ${count} times.`}</Text>
        </View>
    </Window>;
}

render(<App />);
