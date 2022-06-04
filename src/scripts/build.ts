#!/usr/bin/env node

import { resolve, relative, win32 } from "path";
import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync, appendFileSync, rmSync, readdirSync, copyFileSync, lstatSync, readFileSync } from "fs";

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

console.log(`Building react-bond app for all OS 🔥🔥🔥`);

const pwdPath = resolve(process.cwd());
const buildPath = resolve(pwdPath, "build");
const include = getArgvValues("--include");

if (existsSync(buildPath)) {
    rmSync(buildPath, { recursive: true, force: true });
    console.log(`✓ Old build removed.`);
}

mkdirSync(buildPath);
console.log(`✓ Folder build created.`);

console.log(`- Copy include files and folders...`);
include.forEach(name => {
    console.log(`  - Copy ${resolve(pwdPath, name)} -> ${resolve(buildPath, name)}...`);
    copy(resolve(pwdPath, name), resolve(buildPath, name));
});
console.log(`✓ All include files copied.`);

console.log(`Installing production dependencies...`);
execSync(`cd build && npm install --production`, { stdio: "inherit" });
console.log(`✓ All production dependencies installed.`);


const packageString = readFileSync(resolve(buildPath, "package.json"), "utf-8");
const packageJSON = JSON.parse(packageString);
if (typeof packageJSON?.main !== "string") throw new Error("Main file in pacakge.json not found.");

const { main } = packageJSON;
console.log(`✓ Fund main file in package.json "${main}".`);

const linuxAndMacPath = "./" + relative(buildPath, resolve(buildPath, main));
writeFileSync(resolve(buildPath, "run"), `#!/usr/bin/env node
require(${JSON.stringify(linuxAndMacPath)});
`, "utf-8");
execSync(`chmod 777 ${resolve(buildPath, "run")}`, { stdio: "inherit" });
console.log(`✓ Run file for Mac and Linux created with "${JSON.stringify(linuxAndMacPath)}" entry file.`);

const winPath = win32.relative(buildPath, resolve(buildPath, main));
writeFileSync(resolve(buildPath, "run.bat"), `node ${winPath}
`, "utf-8");
console.log(`✓ Run file for Window created with "${JSON.stringify(winPath)}" entry file.`);
