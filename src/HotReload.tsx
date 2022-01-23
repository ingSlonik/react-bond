import { watchFile } from "fs";
import React, { ReactNode } from "react";

// TODO: for more renderers
let renderedComponent: null | { _reactBondHotUpdate?: (component: ReactNode) => void } = null;

export function getHotElement(children: ReactNode): null | ReactNode {
    let MainComponent = (): JSX.Element => <>{children}</>;

    if (renderedComponent) {
        renderedComponent._reactBondHotUpdate?.(MainComponent);
        return null;
    }

    if (isHotReloading()) {
        const { hot } = require("../scripts/hot");
        MainComponent = hot(MainComponent);
        // @ts-ignore
        renderedComponent = MainComponent;

        const entryPath = global._reactBondEntryPath;
        console.log("Watch file:", entryPath);
        watchFile(entryPath, { interval: 350 }, () => {
            // @ts-ignore
            require.deleteCache?.(entryPath);
            require(entryPath);
        });
    }

    // @ts-ignore
    return <MainComponent>{children}</MainComponent>;
}

function isHotReloading(): boolean {
    return global._reactBondHotReload || false;
}
