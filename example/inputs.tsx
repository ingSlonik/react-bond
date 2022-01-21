import React, { useState } from "react";
import { render, Window, View, Text, Input, Switch } from "../src";

render(<Window title="Inputs examples" width={420} height={660}>
    <View style={{ flexGrow: 1, alignItems: "flex-start", padding: 16 }}>
        <InputsExample />
    </View>
</Window>);

function InputsExample() {
    const [text, setText] = useState("Text...");
    const [date, setDate] = useState("2021-12-21");
    const [time, setTime] = useState("21:12");
    const [number, setNumber] = useState(21);
    const [bool, setBool] = useState(false);

    return <>
        <H1>Inputs</H1>

        <H2>Text</H2>
        <Input.Text value={text} onChange={setText} />

        <H2>Text multiline</H2>
        <Input.Text multiline value={text} onChange={setText} />

        <H2>Password</H2>
        <Input.Password value={text} onChange={setText} />

        <H2>Color</H2>
        <Input.Color value={text} onChange={setText} />

        <H2>Date</H2>
        <Input.Date value={date} onChange={setDate} />

        <H2>Time</H2>
        <Input.Time value={time} onChange={setTime} />

        <H2>Number</H2>
        <Input.Number value={number} min={0} max={21} onChange={setNumber} />

        <H2>Range</H2>
        <Input.Range value={number} step={0.5} min={0} max={21} onChange={setNumber} />

        <H2>Switch</H2>
        <View style={{ flexDirection: "row" }}>
            <Switch value={bool} onValueChange={setBool} />
            <View style={{ width: 16 }} />
            <Switch disabled value={bool} onValueChange={setBool} />
        </View>
    </>;
}

function H1({ children }: { children: string }) {
    return <Text style={{ fontSize: 32 }}>{children}</Text>
}
function H2({ children }: { children: string }) {
    return <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 24 }}>{children}</Text>
    </View>;
}
