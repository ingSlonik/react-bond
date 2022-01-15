import React from "react";
import { render, Window, View, Text } from "../src";

render(<>
    <Window title="Window 1" width={420} height={150} position={{ top: 64, left: 64 }}>
        <View style={{ flexGrow: 1, justifyContent: "center" }}>
            <Text style={{ color: "#888", fontSize: 32, textAlign: "center" }}>
                Window 1
            </Text>
        </View>
    </Window>
    <Window title="Window 2" width={420} height={150} position={{ top: 64, left: 640 }}>
        <View style={{ flexGrow: 1, justifyContent: "center" }}>
            <Text style={{ color: "#888", fontSize: 32, textAlign: "center" }}>
                Window 2
            </Text>
            <Window title="Window 3 - inner virtual DOM" width={420} height={150} position={{ top: 265, left: 320 }}>
                <View style={{ flexGrow: 1, justifyContent: "center" }}>
                    <Text style={{ color: "#888", fontSize: 32, textAlign: "center" }}>
                        Window 3 - inner virtual DOM
                    </Text>
                </View>
            </Window>
        </View>
    </Window>
</>);