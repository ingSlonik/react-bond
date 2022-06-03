#!/usr/bin/env node

import Module from "module";
import { resolve, relative } from "path";
import { existsSync, readFileSync, watchFile, unwatchFile, lstatSync } from "fs";
import React from "react";

interface HotFunction {
    (): any;
    _reactBondHotFn: Function;
    _reactBondHotUpdate(fn: Function): void;
}

const cwd = process.cwd();
const watchedFiles: string[] = [];
const listenersOnReload: Function[] = [];
const hotFunctions: { [path: string]: { [name: string]: HotFunction } } = {};
const requireExtensions = [".js", ".ts", ".tsx", ".json"];

const entryPath = process.argv[2];
if (!entryPath) throw new Error("There is not set entry file as first command argument.");

const absoluteEntryPath = resolve(cwd, entryPath);
if (!existsSync(absoluteEntryPath)) throw new Error(`Entry file "${absoluteEntryPath}" doesn't exist.`);

global._reactBondHotReload = true;
global._reactBondUnwatchFiles = unwatch;
global._reactBondEntryPath = absoluteEntryPath;
global._reactBondGetHotRequire = hotReloadRequire;

console.log("✓ react-bond hot reloading is turned on.");

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

                const hotModuleFunctions = {};
                Object.entries(originalModule).forEach(([name, fn]) => {
                    if (typeof fn === "function" && !isClass(fn)) {
                        // all exported functions
                        const hotFunction = createHotFunction(fn, fullPath, name);
                        hotModuleFunctions[name] = hotFunction;
                    }
                });

                if (Object.keys(hotFunctions).length > 0) {
                    watch(fullPath, (newModule) => {
                        Object.entries(newModule).forEach(([name, fn]) => {
                            if (typeof fn === "function") {
                                updateHotFunction(fn, fullPath, name);
                            }
                        });
                    });
                }

                return {
                    ...originalModule,
                    ...hotModuleFunctions,
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

function isClass(variable: any) {
    return typeof variable === "function" && !variable.hasOwnProperty('arguments');
}

function createHotFunction(fn: Function, path: string, name: string): HotFunction {
    if (!hotFunctions[path]) hotFunctions[path] = {};

    if (hotFunctions[path][name]) {
        // component is already created
        return hotFunctions[path][name];
    } else {
        const hotFn = function () {
            try {
                // is react dispatcher set
                if ((React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentDispatcher.current) {

                    const [_, setForceUpdate] = React.useState({});
                    React.useEffect(() => {
                        const reload = () => setForceUpdate({});
                        addListenerOnReload(reload);
                        return () => removeListenerOnReload(reload);
                    }, []);
                }
            } catch (e) {
                // not react component
            }

            const fn = hotFn._reactBondHotFn;
            return fn.apply(this, arguments);
        };

        for (const key in fn) {
            hotFn[key] = fn[key];
        }

        hotFn._reactBondHotFn = fn;
        hotFn._reactBondHotUpdate = (fn: Function) => {
            console.log(new Date(), "Hot reload function:", name);
            hotFn._reactBondHotFn = fn;

            // user changed not react component, to show differences is necessary to re-render all components
            reloadComponents();
        };

        hotFunctions[path][name] = hotFn;
        return hotFn;
    }
}

function updateHotFunction(fn: Function, path: string, name: string) {
    if (!hotFunctions[path]) hotFunctions[path] = {};

    if (hotFunctions[path][name]) {
        hotFunctions[path][name]._reactBondHotUpdate(fn);
    } else {
        console.log("New function created. Press R for include it to hot reloading.")
        createHotFunction(fn, path, name);
    }
}

function addListenerOnReload(fn: Function) {
    listenersOnReload.push(fn);
}
function removeListenerOnReload(fn: Function) {
    const index = listenersOnReload.indexOf(fn);
    if (index > -1) listenersOnReload.splice(index, 1);
}

function reloadComponents() {
    listenersOnReload.forEach(l => l());
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
