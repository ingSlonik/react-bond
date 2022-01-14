import React from "react";
import { getCSSProperties } from "../instance";
import { TextStyle, LayoutStyle } from "../types";

type Style = Partial<TextStyle & LayoutStyle>;

export const Input = {
    Text({ style, multiline, value, onChange }: { style?: Style, multiline?: boolean, value: string, onChange: (value: string) => void }) {
        const cssProperties = getCSSProperties(style);

        if (multiline) {
            return <textarea style={cssProperties} value={value} onChange={e => onChange(e.target.value)} />;
        } else {
            return <input type="text" style={cssProperties} value={value} onChange={e => onChange(e.target.value)} />;
        }
    },
    Password({ style, value, onChange }: { style?: Style, value: string, onChange: (value: string) => void }) {
        const cssProperties = getCSSProperties(style);
        return <input type="password" style={cssProperties} value={value} onChange={e => onChange(e.target.value)} />;
    },
    Color({ style, value, onChange }: { style?: Style, value: string, onChange: (value: string) => void }) {
        const cssProperties = getCSSProperties(style);
        return <input type="color" style={cssProperties} value={value} onChange={e => onChange(e.target.value)} />;
    },
    Date({ style, value, onChange }: { style?: Style, value: string, onChange: (value: string) => void }) {
        const cssProperties = getCSSProperties(style);
        return <input type="date" style={cssProperties} value={value} onChange={e => onChange(e.target.value)} />;
    },
    Time({ style, value, onChange }: { style?: Style, value: string, onChange: (value: string) => void }) {
        const cssProperties = getCSSProperties(style);
        return <input type="time" style={cssProperties} value={value} onChange={e => onChange(e.target.value)} />;
    },
    Number({ style, value, min, max, onChange }: { style?: Style, value: number, min?: number, max?: number, onChange: (value: number) => void }) {
        const cssProperties = getCSSProperties(style);
        return <input type="number" style={cssProperties} value={value} min={min} max={max} onChange={e => onChange(Number(e.target.value))} />;
    },
    Range({ style, value, step, min, max, onChange }: { style?: Style, value: number, step?: number, min?: number, max?: number, onChange: (value: number) => void }) {
        const cssProperties = getCSSProperties(style);
        return <input type="range" style={cssProperties} value={value} step={step} min={min} max={max} onChange={e => onChange(Number(e.target.value))} />;
    },
};
