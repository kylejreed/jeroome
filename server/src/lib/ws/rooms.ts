import type { BroadcastEventType } from "types";
import BroadcastGroup from "./broadcastGroup";
import type Socket from "./socket";

export default class Rooms {
    #rooms = new Map<string, Room>();

    join(name: string, socket: Socket) {
        if (this.#rooms.has(name)) {
            this.#rooms.get(name)!.add(socket);
        } else {
            this.#rooms.set(name, new Room(new Set([socket])));
        }

        return this.#rooms.get(name)!;
    }

    leave(name: string, socket: Socket) {
        if (this.#rooms.has(name)) {
            const room = this.#rooms.get(name)!;
            room.remove(socket);
            if (room.isEmpty()) {
                this.delete(name);
            }
            return room;
        }
    }

    delete(name: string) {
        this.#rooms.delete(name);
    }

    isInRoom(name: string, socket: Socket) {
        return this.#rooms.get(name)?.has(socket) ?? false;
    }

    to(name: string) {
        return this.#rooms.get(name)!.broadcast;
    }

}

class Room {
    constructor(private sockets: Set<Socket> = new Set()) { }

    get broadcast() { return new BroadcastGroup(Array.from(this.sockets)); }

    isEmpty() {
        return this.sockets.size === 0;
    }

    add(socket: Socket) {
        this.sockets.add(socket);
    }

    has(socket: Socket) {
        return this.sockets.has(socket);
    }

    remove(socket: Socket) {
        this.sockets.delete(socket);
    }

    emit<Data>(event: BroadcastEventType, data: Data) {
        this.broadcast.emit(event, data);
    }

    except(socket: Socket) {
        return this.broadcast.except(socket);
    }
}
