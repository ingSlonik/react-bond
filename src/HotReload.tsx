import React, { ReactNode } from "react";

// Only one render in one runtime.
let renderedComponent: null | { _reactBondHotUpdate?: (component: ReactNode) => void } = null;

export function getHotElement(children: ReactNode): null | ReactNode {
    let MainComponent = (): JSX.Element => <>{children}</>;

    if (renderedComponent) {
        renderedComponent._reactBondHotUpdate?.(MainComponent);
        return null;
    }

    if (isHotReloading()) {
        const { watchFile, hot } = require("./scripts/hot");
        MainComponent = hot(MainComponent);
        // @ts-ignore
        renderedComponent = MainComponent;

        watchFile(global._reactBondEntryPath, () => { });
    }

    // @ts-ignore
    return <MainComponent>{children}</MainComponent>;
}

function isHotReloading(): boolean {
    return global._reactBondHotReload || false;
}
