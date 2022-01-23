import { Container } from "./types";

export function createContainer(): Container {

    return {
        state: "init",
        windows: [],
    };
}
