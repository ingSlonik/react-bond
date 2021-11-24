import React, { useState } from "react";
import { render, Window, View, Text, Pressable } from "../src";

render(<Calculator />);

function Calculator() {
    const [ number, setNumber ] = useState("0");

    const [ operation, setOperation ] = useState("");
    const [ numberBefore, setNumberBefore ] = useState(0);

    function addNumber(num: number) {
        setNumber(n => Number(n + num).toString());
    }

    function addOperation(operation: string) {
        setNumberBefore(Number(number));
        setNumber("0");
        setOperation(operation);
    }

    function count() {
        const value = Number(number);
        setNumberBefore(value);

        switch (operation) {
            case "%": return setNumber(String(numberBefore * value / 100));
            case "/": return setNumber(String(numberBefore / value));
            case "*": return setNumber(String(numberBefore * value));
            case "-": return setNumber(String(numberBefore - value));
            case "+": return setNumber(String(numberBefore + value));
        }
    }

    return <Window title="Desktop calculator" width={274} height={444}>
        <View style={{ flexGrow: 1, overflow: "hidden", backgroundColor: "#222" }}>
            <View>
                <Text style={{ color: "#888", fontSize: 64, textAlign: "center" }}>{number}</Text>
            </View>

            <View style={{ flexWrap: "wrap", flexDirection: "row" }}>
                <Button color="#444" onPress={() => setNumber("0")}>AC</Button>
                <Button color="#444" onPress={() => setNumber(n => String(-Number(n)))}>+/-</Button>
                <Button color="#444" onPress={() => addOperation("%")}>%</Button>
                <Button color="orange" onPress={() => addOperation("/")}>/</Button>
                
                <Button onPress={() => addNumber(7)}>7</Button>
                <Button onPress={() => addNumber(8)}>8</Button>
                <Button onPress={() => addNumber(9)}>9</Button>
                <Button color="orange" onPress={() => addOperation("*")}>x</Button>

                <Button onPress={() => addNumber(4)}>4</Button>
                <Button onPress={() => addNumber(5)}>5</Button>
                <Button onPress={() => addNumber(6)}>6</Button>
                <Button color="orange" onPress={() => addOperation("-")}>-</Button>

                <Button onPress={() => addNumber(1)}>1</Button>
                <Button onPress={() => addNumber(2)}>2</Button>
                <Button onPress={() => addNumber(3)}>3</Button>
                <Button color="orange" onPress={() => addOperation("+")}>+</Button>

                <Button long onPress={() => addNumber(0)}>0</Button>
                <Button onPress={() => setNumber(n => `${n}.`)}>,</Button>
                <Button color="orange" onPress={() => count()}>=</Button>
            </View>
        </View>
    </Window>;
}

type ButtonProps = {
    long: boolean,
    color: string,
    onPress: () => void,
    children: string,
};

Button.defaultProps = {
    long: false,
    color: "#888",
};

function Button({ long, color, onPress, children }: ButtonProps) {
    return <Pressable
        style={{
            margin: 2,
            width: long ? 132 : 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: color,
            justifyContent: "center",
        }}
        onPress={onPress}
    >
        <Text style={{ textAlign: "center", color: "white", fontSize: 21, fontWeight: "bold" }}>
            {children}
        </Text>
    </Pressable>;
}
