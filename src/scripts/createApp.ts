#!/usr/bin/env node

import { resolve } from "path";
import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";

console.log(`Creating app based on react-bond 🔥🔥🔥`);

const name = process.argv[2];
if (!name) throw new Error("There is not set name of app as first command argument.");

const appPath = resolve(process.cwd(), name);
if (existsSync(appPath)) throw new Error(`Folder "${appPath}" already exists.`);

mkdirSync(appPath);
console.log(`✓ Folder "${name}" created.`);

writeFileSync(resolve(appPath, "package.json"), JSON.stringify({
    name,
    version: "0.1.0",
    "description": "My application based on react-bond.",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "react-bond-hot src/index.tsx",
        "build": "tsc",
    },
    "author": "",
    "license": "MIT",
    "dependencies": {
        "react": "x.x.x",
        "react-bond": "x.x.x"
    },
    "devDependencies": {
        "@types/node": "x.x.x",
        "@types/react": "x.x.x",
        "typescript": "4.x.x"
    }
}, null, "    "), "utf-8");
console.log(`✓ package.json created.`);

writeFileSync(resolve(appPath, ".gitignore"), `lib/\nnode_modules/`, "utf-8");
console.log(`✓ .gitignore added.`);

writeFileSync(resolve(appPath, "tsconfig.json"), JSON.stringify({
    compilerOptions: {
        target: "es2020",
        module: "commonjs",
        outDir: "lib",
        declaration: true,
        sourceMap: true,
        jsx: "react",
        esModuleInterop: true,
        strictNullChecks: true,
    },
    files: ["src/index.tsx"]
}, null, "    "), "utf-8");
console.log(`✓ TypeScript configuration set.`);

const srcPath = resolve(appPath, "src");
mkdirSync(srcPath);
writeFileSync(resolve(srcPath, "index.tsx"), `import React from "react";
import { render } from "react-bond";

import { App } from "./App";

render(<App />);
`, "utf-8");

writeFileSync(resolve(srcPath, "App.tsx"), `import React from "react";
import { Window, View, Text } from "react-bond";

export function App() {
    return <Window title=${JSON.stringify(name)} width={640} height={150}>
        <View style={{ flexGrow: 1, justifyContent: "center" }}>
            <Text style={{ color: "#888", fontSize: 32, textAlign: "center" }}>
                Hello, I am ${JSON.stringify(name)}.
            </Text>
        </View>
    </Window>;
}
`, "utf-8");

console.log(`✓ Default source code created to "src" folder.`);

console.log(`Installing dependencies...`);
execSync(`cd ${name} && npm install`, { stdio: "inherit" });

console.log(`✓ dependencies installed.`);

// ------------ DONE ------------
console.log("\n👍 Thank you for choosing a react-bond. 👍");
console.log(`\nOpen folder with your application "$ cd ${name}".`);
console.log(`Develop your application with "$ npm start".`);
console.log(`You will see all changes in the "src" folder immediately.`);
console.log(`\nBuild your application with "$ npm run build".`);
console.log("\n");
