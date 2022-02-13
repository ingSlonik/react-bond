import React from "react";

import { getCSSProperties } from "../style";

import { TextStyle, LayoutStyle } from "../types";

type GeneralInputProps = {
    style?: Partial<TextStyle & LayoutStyle>,
    disable?: boolean,
};

export const Input = {
    Text({ style, value, multiline, onChange, ...props }: GeneralInputProps & { multiline?: boolean, maxLength?: number, value: string, onChange: (value: string) => void }) {
        const cssProperties = getCSSProperties(style);

        if (multiline) {
            return <textarea {...props} style={cssProperties} value={value} onChange={e => onChange(e.target.value)} />;
        } else {
            return <input {...props} type="text" style={cssProperties} value={value} onChange={e => onChange(e.target.value)} />;
        }
    },
    Password({ style, value, onChange, ...props }: GeneralInputProps & { value: string, maxLength?: number, onChange: (value: string) => void }) {
        const cssProperties = getCSSProperties(style);
        return <input {...props} type="password" style={cssProperties} value={value} onChange={e => onChange(e.target.value)} />;
    },
    Color({ style, value, onChange, ...props }: GeneralInputProps & { value: string, onChange: (value: string) => void }) {
        const cssProperties = getCSSProperties(style);
        return <input {...props} type="color" style={cssProperties} value={value} onChange={e => onChange(e.target.value)} />;
    },
    Date({ style, value, onChange, ...props }: GeneralInputProps & { value: string, onChange: (value: string) => void }) {
        const cssProperties = getCSSProperties(style);
        return <input {...props} type="date" style={cssProperties} value={value} onChange={e => onChange(e.target.value)} />;
    },
    Time({ style, value, onChange, ...props }: GeneralInputProps & { value: string, onChange: (value: string) => void }) {
        const cssProperties = getCSSProperties(style);
        return <input {...props} type="time" style={cssProperties} value={value} onChange={e => onChange(e.target.value)} />;
    },
    Number({ style, value, min, max, onChange, ...props }: GeneralInputProps & { value: number, min?: number, max?: number, onChange: (value: number) => void }) {
        const cssProperties = getCSSProperties(style);
        return <input {...props} type="number" style={cssProperties} value={value} min={min} max={max} onChange={e => onChange(Number(e.target.value))} />;
    },
    Range({ style, value, step, min, max, onChange, ...props }: GeneralInputProps & { value: number, step?: number, min?: number, max?: number, onChange: (value: number) => void }) {
        const cssProperties = getCSSProperties(style);
        return <input {...props} type="range" style={cssProperties} value={value} step={step} min={min} max={max} onChange={e => onChange(Number(e.target.value))} />;
    },
};
