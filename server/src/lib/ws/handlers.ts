import type WebSocketServer from ".";
import type Socket from "./socket";

export type MessageHandler<T = any> = (data: T, socket: Socket, server: WebSocketServer) => void;

export const handlers: Record<string, MessageHandler> = {
    "chat:join-room": (data: { roomName: string; }, socket, server) => {
        const room = server.rooms.join(data.roomName, socket);
        room.except(socket).emit("chat:new-user", { name: socket.user?.name ?? "Anon" });
    },
    "chat:leave-room": (data: { roomName: string; }, socket, server) => {
        const room = server.rooms.leave(data.roomName, socket);
        if (!room) return;

        room.emit("chat:user-left", { name: socket.user!.id });
    },
    "chat:message": (data: { roomName: string; message: string; }, socket, server) => {
        if (server.rooms.isInRoom(data.roomName, socket)) {
            server.rooms.to(data.roomName).emit("chat:message", { user: socket.user, message: data.message });
        }
    }
}
