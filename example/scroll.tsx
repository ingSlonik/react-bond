import React from "react";
import { render, Window, View, ScrollView, Text } from "../src";

render(<Window title="Scroll example" width={250} height={250}>
    <View style={{ flexGrow: 1, flexDirection: "row" }}>
        <View style={{ width: "50%" }}>
            <Text style={{ textAlign: "center" }}>Vertical</Text>
            <ScrollView>
                {Array.from({ length: 20 }).map((_, i) => <Text key={i} style={{ color: "#888", textAlign: "center" }}>
                    Really long text.
                </Text>)}
            </ScrollView>
        </View>
        <View style={{ width: "50%" }}>
            <Text style={{ textAlign: "center" }}>Horizontal</Text>
            <ScrollView horizontal>
                {Array.from({ length: 20 }).map((_, i) => <Text key={i} style={{ color: "#888", textAlign: "center" }}>
                    Really long text.
                </Text>)}
            </ScrollView>
        </View>
    </View>
</Window>);