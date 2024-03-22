import type { OutgoingEventType } from "types";
import type Socket from "./socket";

export default class BroadcastGroup {
    constructor(private sockets: Socket[]) { }

    emit<Data>(type: OutgoingEventType, data: Data) {
        for (const socket of this.sockets) {
            socket.emit(type, data);
        }
    }

    except(socket: Socket) {
        return new BroadcastGroup(this.sockets.filter(s => s !== socket));
    }
}
