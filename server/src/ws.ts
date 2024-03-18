import { type Context, Hono } from "hono";
import { createBunWebSocket } from "hono/bun";

import type { HonoContext, SocketContext } from "@types";
import WebSocketServer from "@lib/ws";
import { generateId } from "lucia";
import Socket from "@lib/ws/socket";

const { websocket, upgradeWebSocket } = createBunWebSocket();

const wss = new WebSocketServer();
const WebSocketRouter = new Hono<HonoContext>();
WebSocketRouter.get("/", upgradeWebSocket((c: Context<HonoContext>) => {
    return {
        onOpen: (_, ws) => {
            const context = ws as SocketContext;
            context.raw.data = { id: generateId(15), user: c.var.user };
            wss.onOpen(new Socket(context));
        },
        onMessage: (e, ws) => {
            const context = ws as SocketContext;
            const socket = wss.getSocket(context)!;
            wss.onMessage(socket, e.data);
        },
        onClose: (e, ws) => {
            const context = ws as SocketContext;
            const socket = wss.getSocket(context)!;
            wss.onClose(socket, e);
        },
        onError: (e, ws) => {
            const context = ws as SocketContext;
            const socket = wss.getSocket(context)!;
            wss.onError(socket, e);
        }
    };
}));

export { websocket };
export default WebSocketRouter;
