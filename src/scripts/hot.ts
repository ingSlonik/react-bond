#!/usr/bin/env node

import Module from "module";
import { resolve, relative } from "path";
import { existsSync, readFileSync, watchFile, unwatchFile, lstatSync } from "fs";

import { useState } from "react";

const cwd = process.cwd();
const watchedFiles: string[] = [];
const requireExtensions = [".js", ".ts", ".tsx", ".json"];

const entryPath = process.argv[2];
if (!entryPath) throw new Error("There is not set entry file as first command argument.");

const absoluteEntryPath = resolve(cwd, entryPath);
if (!existsSync(absoluteEntryPath)) throw new Error(`Entry file "${absoluteEntryPath}" doesn't exist.`);

console.log("✓ react-bond hot reloading is turned on.");
global._reactBondHotReload = true;
global._reactBondUnwatchFiles = unwatch;
global._reactBondEntryPath = absoluteEntryPath;
global._reactBondGetHotRequire = hotReloadRequire;

let typeScriptConfig = null;
const tsconfigPath = resolve(cwd, "tsconfig.json");
if (existsSync(tsconfigPath)) {
    const { readConfigFile } = require("typescript");
    const options = readConfigFile(tsconfigPath, (path: string) => readFileSync(path, "utf8"));
    typeScriptConfig = options.config;
}

if (typeScriptConfig) {
    console.log("✓ TypeScript compilation turned on.");
} else {
    console.log("- Without TypeScript compilation.");
}

Module.wrap = (code) => `(function (exports, require, module, __filename, __dirname) {
require = global._reactBondGetHotRequire(require, __dirname);
${compile(code)}
});`;

startStdin();
console.log(`✓ Hot keys activated (R and ${process.platform === "darwin" ? "CMD" : "CTRL"}+C).`);

// -------------- run --------------
console.log("");
console.log(`Staring application...`);
try {
    require(absoluteEntryPath);
} catch (e) {
    throw e;
}

watch(absoluteEntryPath, () => console.log("Entry file was changed, whole application is reloading."));

// -------------- functions --------------

function startStdin() {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    stdin.on("data", stdinData);
}

function stopStdin() {
    const stdin = process.stdin;
    stdin.off("data", stdinData);
    process.exit();
}

function stdinData(buffer: Buffer) {
    const key = buffer.toString();

    if (key === '\u0003') {
        console.log(`${process.platform === "darwin" ? "CMD" : "CTRL"} + C - close react-bond hot reloading.`);
        process.exit();
    } else if (key === "r") {
        console.log("R - reloading application.");
        watchedFiles.forEach(file => {
            delete require.cache[require.resolve(file)];
        });
        require(absoluteEntryPath);
    } else {
        console.log(`${key} - no effect. Only R for reload and ${process.platform === "darwin" ? "CMD" : "CTRL"}+C for close is allowed.`);
    }
}

function compile(source: string): string {
    if (typeScriptConfig) {
        const result = require("typescript").transpileModule(source, typeScriptConfig);
        return result.outputText;
    } else {
        return source;
    }
}

function hotReloadRequire(originalRequire: NodeRequire, __dirname: string): NodeRequire {
    const require = (path: string): any => {
        if (path.startsWith(".") || path.startsWith("/")) {

            const fullPath = getPathWithExtension(resolve(path.startsWith(".") ? __dirname : cwd, path));
            if (!fullPath.includes("node_modules")) {
                const originalModule = originalRequire(fullPath);

                const hotFunctions = {};
                Object.entries(originalModule).forEach(([name, fn]) => {
                    if (typeof fn === "function") {
                        if (name === "default" || startsWithCapital(name)) {
                            // can by react component
                            const hotComponent = hot(fn, true);
                            hotFunctions[name] = hotComponent;
                        } else {
                            // all exported functions
                            const hotFunction = hot(fn, false);
                            hotFunctions[name] = hotFunction;
                        }
                    }
                });

                if (Object.keys(hotFunctions).length > 0) {
                    watch(fullPath, (newModule) => {
                        for (const name in hotFunctions) {
                            hotFunctions[name]._reactBondHotUpdate(newModule[name]);
                        }
                    });
                }

                return {
                    ...originalModule,
                    ...hotFunctions,
                };
            } else {
                return originalRequire(fullPath);
            }
        } else {
            return originalRequire(path);
        }
    };

    require.cache = originalRequire.cache;
    require.resolve = originalRequire.resolve;
    require.extensions = originalRequire.extensions;
    require.main = originalRequire.main;
    require.deleteCache = (path: string) => {
        delete originalRequire.cache[originalRequire.resolve(path)];
    };

    return require;
}

function watch(path: string, callback: (module: any) => void) {
    if (!watchedFiles.includes(path)) {
        console.log("Watch:", relative(cwd, path));
        watchedFiles.push(path);

        watchFile(path, { interval: 500 }, () => {
            delete require.cache[require.resolve(path)];
            const newModule = require(path);

            callback(newModule);
        });
    }
}

function unwatch() {
    watchedFiles.forEach(file => {
        console.log("Unwatch:", relative(cwd, file));
        unwatchFile(file);
    });

    stopStdin();
}

function hot(component: Function, isComponent: boolean): Function {
    const hotComponent = function () {
        const component = hotComponent._reactBondHotComponent;

        if (isComponent) {
            const [_, setReload] = useState({});
            hotComponent._reactBondHotReload = () => setReload({});
        }

        return component.apply(this, arguments);
    };

    for (const key in component) {
        hotComponent[key] = component[key];
    }

    hotComponent._reactBondHotComponent = component;
    hotComponent._reactBondHotReload = null;
    hotComponent._reactBondHotUpdate = (component: Function) => {
        console.log(new Date(), "Hot reload component:", component?.name);
        hotComponent._reactBondHotComponent = component;
        hotComponent._reactBondHotReload?.();
    };

    return hotComponent;
}

function startsWithCapital(word: string): boolean {
    return word.charAt(0) === word.charAt(0).toUpperCase();
}

function getPathWithExtension(path: string): string {
    if (existsSync(path)) {
        if (isDirectory(path)) {
            return getPathWithExtension(resolve(path, "index"));
        } else {
            return path;
        }
    } else {
        for (const ext of requireExtensions) {
            const fullPath = path + ext;
            if (existsSync(fullPath)) return fullPath;
        }
    }

    throw new Error(`Required file "${path}" doesn't exist.`);
}

function isDirectory(path: string): boolean {
    return existsSync(path) && lstatSync(path).isDirectory();
}
