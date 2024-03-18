import type { WSMessageReceive } from "hono/ws";
import Socket from "./socket";
import type { SocketContext } from "@types";

export default class WebSocketServer {
    #connections = new Map<string, Socket>();

    constructor() { }

    onOpen(socket: Socket): void {
        console.log("Connection!");
        this.#connections.set(socket.id, socket);
    }

    onMessage(socket: Socket, data: WSMessageReceive): void {
    }

    onClose(socket: Socket, e: CloseEvent): void {
        this.#connections.delete(socket.id);
    }

    onError(socket: Socket, e: Event): void {
    }

    getSocket(ws: SocketContext) {
        const id = ws.raw.data?.id;
        return this.#connections.get(id);
    }

}

