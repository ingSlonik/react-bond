import { statSync } from "fs";

import React, { useState } from "react";
import { render, Window, View, Text, File } from "../src";

function App() {
    const [paths, setPaths] = useState<string[]>([]);

    return <Window title="Upload file example" width={640} height={250}>
        <View style={{ flexGrow: 1, justifyContent: "flex-start", padding: 32 }}>
            <File onFiles={setPaths} />

            {paths.map(path => <View key={path} style={{ marginTop: 8 }}>
                <Text>{path}</Text>
            </View>)}
        </View>
    </Window>;
}

render(<App />);
