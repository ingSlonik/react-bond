#!/usr/bin/env node

import { resolve, relative, win32 } from "path";
import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync, appendFileSync, rmSync, readdirSync, copyFileSync, lstatSync, readFileSync } from "fs";

function ok(text: string) {
    console.log("\x1b[32m\x1b[1m", "✓", "\x1b[0m", text);
}
function dash(text: string) {
    console.log("\x1b[33m\x1b[1m", "-", "\x1b[0m", text);
}
function bold(text: string) {
    console.log("\x1b[1m", text, "\x1b[0m");
}

function getArgvValues(name: string): string[] {
    let is = false;
    let values: string[] = [];
    for (const value of process.argv) {
        if (value.startsWith("-")) {
            is = value === name;
            continue;
        }
        if (is) values.push(value);
    }
    return values;
}

function copy(pathFrom: string, pathTo: string) {
    if (!existsSync(pathFrom)) return;

    const ls = lstatSync(pathFrom);

    if (ls.isFile()) {
        copyFileSync(pathFrom, pathTo);
    }
    if (ls.isDirectory()) {
        if (!existsSync(pathTo)) mkdirSync(pathTo);
        readdirSync(pathFrom, "utf-8").forEach(name => copy(resolve(pathFrom, name), resolve(pathTo, name)));
    }
}

bold(`Building react-bond app for all OS 🔥🔥🔥`);

const pwdPath = resolve(process.cwd());
const buildPath = resolve(pwdPath, "build");
const include = getArgvValues("--include");

if (existsSync(buildPath)) {
    rmSync(buildPath, { recursive: true, force: true });
    ok(`Old build removed.`);
}

mkdirSync(buildPath);
ok(`Folder build created.`);

dash(`Copy include files and folders (${include.join(", ")})...`);
include.forEach(name => copy(resolve(pwdPath, name), resolve(buildPath, name)));
ok(`All include files copied.`);

dash(`Installing production dependencies...`);
execSync(`cd build && npm install --production --ignore-scripts`, { stdio: "inherit" });
ok(`All production dependencies installed.`);


const packageString = readFileSync(resolve(buildPath, "package.json"), "utf-8");
const packageJSON = JSON.parse(packageString);
if (typeof packageJSON?.main !== "string") throw new Error("Main file in pacakge.json not found.");

const { main } = packageJSON;
ok(`Found main file in package.json "${main}".`);

const runLinuxAndMacPath = resolve(buildPath, "app");
const linuxAndMacPath = "./" + relative(buildPath, resolve(buildPath, main));
writeFileSync(runLinuxAndMacPath, `#!/usr/bin/env node
require(${JSON.stringify(linuxAndMacPath)});
`, "utf-8");
execSync(`chmod +x ${runLinuxAndMacPath}`, { stdio: "inherit" });
writeFileSync(runLinuxAndMacPath + "Bash", `#!/bin/bash
node ${resolve(buildPath, main)}
`, "utf-8");
execSync(`chmod +x ${runLinuxAndMacPath + "Bash"}`, { stdio: "inherit" });
ok(`Run file for Mac and Linux created with ${JSON.stringify(linuxAndMacPath)} entry file.`);

const winPath = win32.relative(buildPath, resolve(buildPath, main));
writeFileSync(resolve(buildPath, "app.bat"), `@echo off
node ${winPath}
exit
`, "utf-8");
ok(`Run file for Window created with ${JSON.stringify(winPath)} entry file.`);
