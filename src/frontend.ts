import { Props, Child} from "./types";

async function start() {
    const ws = await connect();

    ws.onopen = (event) => {
        ws.send(JSON.stringify({ type: "message", message: "WebSocket opened." }));
    };

    ws.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data);
        
            switch (msg.type) {
                case "append": return append(ws, msg.parentId, msg.child);
                case "update": return update(ws, msg.id, msg.props);
                default:
                    throw new Error(`Unknown message type "${msg.type}".`);
            }   
        } catch (e) {
            ws.send(JSON.stringify({
                type: "error",
                error: { name: e.name, message: e.message, stack: e.stack }, 
            }));
        }
    }
}

async function connect(): Promise<WebSocket> {
    return new Promise(resolve => {
        try {
            const ws = new WebSocket(`ws://${window.location.host}/`);
            resolve(ws);
        } catch (e) {
            setTimeout(() => connect().then(resolve), 30);
        }
    });
} 

function append(ws: WebSocket, parentId: string, child: Child) {
    const id = child.id;
    const style = child.props.style;
    const events = child.props.events;

    const element = document.createElement(child.type === "text" ? "span" : "div");
    element.id = id;

    for (const key in style) element.style[key] = style[key];
    events.forEach(eventType => addListener(ws, element, eventType));

    if (child.props.text) element.innerText = child.props.text;

    const parent = document.getElementById(parentId);
    if (!parent) throw new Error(`Element (parent) with id "${parentId}" doesn't exist.`)
    parent.append(element);
}

function update(ws: WebSocket, id: string, props: Partial<Props>) {
    const element = document.getElementById(id);

    if (!element) throw new Error(`Element with id "${id}" doesn't exist.`);

    const style = props.style;
    for (const key in style) element.style[key] = style[key];

    if (props.text) element.innerText = props.text;
}

function addListener(ws: WebSocket, element: HTMLElement, eventType: string) {
    switch (eventType) {
        case "onPress": return element.addEventListener("click", () => ws.send(JSON.stringify({ type: "event", id: element.id, eventType, value: null })));
        default:
            throw new Error(`Unknown event type "${eventType}".`)
    }
}

export function getHTML(): string {
    return `
<!DOCTYPE html>
<html lang="en">
    
<head>
    <meta charset="utf-8" />
    <style>
        * {
            margin: 0px;
            padding: 0px;
        }
        div {
            display: flex;
            flex-direction: column;
        }
        #root {
            position: relative;
            width: 100%;
            height: 100vh;
        }
    </style>
</head>

<body>
    <div id="root"></div>
    <script>
        ${start.toString()}
        ${connect.toString()}
        ${append.toString()}
        ${update.toString()}
        ${addListener.toString()}
    
        // Let's go
        start();
    </script>
</body>
</html>`;
}