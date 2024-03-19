import type { BroadcastEventType } from "types";
import type Socket from "./socket";

export default class BroadcastGroup {
    constructor(private sockets: Socket[]) { }

    emit<Data>(type: BroadcastEventType, data: Data) {
        for (const socket of this.sockets) {
            socket.send(type, data);
        }
    }

    except(socket: Socket) {
        return new BroadcastGroup(this.sockets.filter(s => s !== socket));
    }
}
