import type { OutgoingEventType, SocketContext } from "@types";

export default class Socket {
    constructor(private ctx: SocketContext) { }

    get id() { return this.ctx.raw.data!.id; }
    get user() { return this.ctx.raw.data!.user; }

    emit<T>(type: OutgoingEventType, data: T) {
        this.ctx.send(JSON.stringify({ type, data }));
    }
}
