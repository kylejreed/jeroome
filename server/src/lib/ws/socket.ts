import type { BroadcastEventType, SocketContext } from "@types";

export default class Socket {
    constructor(private ctx: SocketContext) { }

    get id() { return this.ctx.raw.data!.id; }
    get user() { return this.ctx.raw.data!.user; }

    send<T>(type: BroadcastEventType, data: T) {
        this.ctx.send(JSON.stringify({ type, data }));
    }
}
