import type { WSMessageReceive } from "hono/ws";

import type { SocketContext, WSMessage } from "@types";
import Socket from "./socket";
import { handlers } from "./handlers";
import Rooms from "./rooms";

export default class WebSocketServer {
    #handlers = handlers;
    #connections = new Map<string, Socket>();
    rooms = new Rooms();

    onOpen(socket: Socket): void {
        console.log("Connection!", socket.id);
        this.#connections.set(socket.id, socket);

        socket.send("welcome", socket.user?.name ?? "Anon");
    }

    onMessage(socket: Socket, data: WSMessageReceive): void {
        const message = this.#parseMessage(data);
        if (message) {
            console.log("Message received: ", message);
            this.#handlers[message.type]?.(message?.data, socket, this);
        }
    }

    onClose(socket: Socket, e: CloseEvent): void {
        this.#connections.delete(socket.id);
        console.log("Disconnection!", socket.id, e.reason, e.code);
    }

    onError(socket: Socket, e: Event): void {
        console.error("Error", e, socket.id);
    }

    getSocket(ws: SocketContext) {
        const id = ws.raw.data?.id;
        return this.#connections.get(id);
    }

    #parseMessage<T>(msg: WSMessageReceive) {
        if (typeof msg === "string") {
            return JSON.parse(msg) as WSMessage<T>;
        }
    }
}

