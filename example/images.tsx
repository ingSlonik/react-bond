import { resolve } from "path";

import React from "react";
import { render, Window, View, Text, Image } from "../src";

render(<Window title="Images app" width={640} height={660}>
    <View style={{ flexGrow: 1, alignItems: "flex-start", padding: 16 }}>
        <H1>Images</H1>

        <H2>Image from url</H2>
        <Image src="https://picsum.photos/128" />

        <H2>Image from file (relative path from root)</H2>
        <Image src="./example/turtle.png" />

        <H2>Image from file (absolute path)</H2>
        <Image src={resolve(__dirname, "turtle.png")} />

        <H2>Image from base64 "data:image/png;base64,iVBOR....."</H2>
        <Image src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" />
    </View>
</Window>);

function H1({ children }: { children: string }) {
    return <Text style={{ fontSize: 32 }}>{children}</Text>
}
function H2({ children }: { children: string }) {
    return <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 24 }}>{children}</Text>
    </View>;
}
