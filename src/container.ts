import http from "http";
import { readFileSync } from "fs";
import { resolve } from "path";

import findFreePort from "find-free-port";
import { WebSocket, WebSocketServer } from "ws";

import { Child, ChildProps, Props, Container, Instance, MessageToBackend, MessageToFrontEnd } from "./types";

const frontend = readFileSync(resolve(__dirname, "frontend.html"), "utf-8");

const eventListener: Array<{ id: string, eventType: string, listener: (value: null | number | string) => void }> = [];

// TODO: run server when is window and stop when is not
export async function createContainer(): Promise<Container> {
    
    const port = await getPort();

    return {
        port,
        windows: [],
        async append(parent, child) {
            if (parent.id === null || child.id === null)
                throw new Error("It is not possible to append element without id.");
            
            const ws = await getWS(port);
            
            const message: MessageToFrontEnd = {
                type: "append",
                parentId: parent.id,
                child: getChildForMessage(child),
            };
            
            // Handle events
            for (const [ eventType, listener ] of Object.entries(child.props.events || {})) {
                eventListener.push({ id: child.id, eventType, listener });
            }
            
            // console.log(message);
            ws.send(JSON.stringify(message));
        },
        async update(instance, newProps) {
            if (instance.id === null)
                throw new Error("Unreachable.");

            const ws = await getWS(port);
            
            const message: MessageToFrontEnd = {
                type: "update",
                id: instance.id,
                props: getChildProps(newProps),
            };

            // console.log(message);
            ws.send(JSON.stringify(message));
        }
    };
}

let ws: null | Promise<WebSocket> = null;
let port: null | number = null;

async function getWS(port: number): Promise<WebSocket> {
    if (ws === null) {
        ws = runServer(port);
    }
    return ws;
}
async function getPort(): Promise<number> {
    if (port === null) {
        const ffp = await findFreePort(8000);
        port = ffp[0] as number;
    }
    return port;
}

function runServer(port: number): Promise<WebSocket> {
    return new Promise(async resolve => {
        const server = http.createServer((req, res) => {
            res.writeHead(200);
            res.end(frontend);
        });
        const wss = new WebSocketServer({ server });
    
        wss.on("connection", (ws) => {
            ws.on("message", (message) => {
                const mes = JSON.parse(message.toString("utf-8")) as MessageToBackend;
                console.log("FE:", mes);

                if (mes.type === "event") {
                    eventListener
                        .filter(({ id, eventType }) => id === mes.id && eventType === mes.eventType)
                        .forEach(({ listener }) => listener(mes.value));
                }
            });

            resolve(ws);
        });

        server.listen(port);
        console.log(`Server is running on port ${port}`);
    });
}

function getChildForMessage(instance: Instance): Child {
    return {
        id: String(instance.id),
        type: instance.type,
        props: getChildProps(instance.props),
    };
}

function getChildProps(props: Partial<Props>): ChildProps {
    return {
        style: props.style || {},
        text: props.text || null,
        events: Object.keys(props.events || {}),
    }
}