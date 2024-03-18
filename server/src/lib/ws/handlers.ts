import type Socket from "./socket";

export type MessageHandler<T = unknown> = (data: T, socket: Socket) => void;

export const handlers: Record<string, MessageHandler> = {
    "test": (data) => { }
}
