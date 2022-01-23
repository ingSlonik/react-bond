#!/usr/bin/env node

const Module = require("module");
const { resolve } = require("path");
const { existsSync, readFileSync, watchFile, unwatchFile, lstatSync } = require("fs");

const { useState } = require("react");

const requireExtensions = [".js", ".ts", ".tsx"];

const appPath = process.argv[2];
const absoluteAppPath = resolve(process.cwd(), appPath);

const watchedFiles = [];

if (!appPath) throw new Error("There is not set entry file as first command argument.");
if (!existsSync(absoluteAppPath)) throw new Error(`Entry file "${absoluteAppPath}" doesn't exist.`);

console.log("✓ react-bond hot reloading is turned on.");
global._reactBondHotReload = true;
global._reactBondEntryPath = absoluteAppPath;
global._reactBondGetHotRequire = hotReloadRequire;

let typeScriptConfig = null;
const tsconfigPath = resolve(process.cwd(), "tsconfig.json");
if (existsSync(tsconfigPath)) {
    const { transpileModule, readJsonConfigFile, readConfigFile, findConfigFile } = require("typescript");
    const options = readConfigFile(tsconfigPath, path => readFileSync(path, "utf8"));
    typeScriptConfig = options.config;
}

if (typeScriptConfig) {
    console.log("✓ TypeScript compilation turned on.");
} else {
    console.log("- Without TypeScript compilation.");
}

Module.wrap = function (js) {
    return `${Module.wrapper[0]}
    require = global._reactBondGetHotRequire(require, __dirname);
    ${compile(js)}
    ${Module.wrapper[1]}`;
};

exports.hot = hot;
exports.watchFile = watch;

// RUN
console.log("");
require(absoluteAppPath);

const { addRenderListenerEnd } = hotReloadRequire(require, __dirname)("../render");
addRenderListenerEnd(() => {
    watchedFiles.forEach(file => {
        console.log("Unwatch file:", file);
        unwatchFile(file);
    });
});

function compile(source) {
    if (typeScriptConfig) {
        const result = require("typescript").transpileModule(source, typeScriptConfig);
        return result.outputText;
    } else {
        return source;
    }
}

function hotReloadRequire(originalRequire, __dirname) {
    const require = (path) => {
        if (path.startsWith(".") || path.startsWith("/")) {

            const fullPath = getPathWithExtension(resolve(path.startsWith(".") ? __dirname : process.cwd(), path));
            if (!fullPath.includes("node_modules")) {
                const module = originalRequire(fullPath);

                const hotComponents = {};
                Object.entries(module).forEach(([name, component]) => {
                    const name0 = name.charAt(0);
                    if (typeof component === "function" && (name === "default" || name0 === name0.toUpperCase())) {
                        // can by react component
                        const hotComponent = hot(component);
                        hotComponents[name] = hotComponent;
                        module[name] = hotComponent;
                    }
                });

                if (Object.keys(hotComponents).length > 0) {
                    watch(fullPath, (newModule) => {
                        for (const name in hotComponents) {
                            hotComponents[name]._reactBondHotUpdate(newModule[name]);
                        }
                    });
                }

                return module;
            } else {
                return originalRequire(fullPath);
            }
        } else {
            return originalRequire(path);
        }
    };

    require.cache = originalRequire.cache;
    require.resolve = originalRequire.resolve;
    require.deleteCache = (path) => {
        delete originalRequire.cache[originalRequire.resolve(path)];
    };

    return require;
}

function watch(path, callback) {
    console.log("Watch file:", path);
    watchedFiles.push(path);

    watchFile(path, { interval: 350 }, () => {
        delete require.cache[require.resolve(path)];
        const newModule = require(path);

        callback(newModule);
    });
}

function hot(component) {
    const hotComponent = function () {
        const component = hotComponent._reactBondHotComponent;

        const [_, setReload] = useState(0);
        hotComponent._reactBondHotReload = () => setReload(r => r + 1);

        return component.apply(this, arguments);
    };

    hotComponent._reactBondHotComponent = component;
    hotComponent._reactBondHotReload = null;
    hotComponent._reactBondHotUpdate = (component) => {
        console.log(new Date(), "Hot reload component:", component?.name);
        hotComponent._reactBondHotComponent = component;
        hotComponent._reactBondHotReload?.();
    };

    return hotComponent;
}

function startsWithCapital(word) {
    return word.charAt(0) === word.charAt(0).toUpperCase()
}

function getPathWithExtension(path) {
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

function isDirectory(path) {
    return existsSync(path) && lstatSync(path).isDirectory();
}
