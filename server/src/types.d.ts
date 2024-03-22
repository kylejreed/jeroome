import type { Lucia, Session, User } from 'lucia';

import type { TursoClient } from "./lib/turso";
import type { OAuthHandlerMap } from './lib/lucia/oauth';
import type { PrimaryDB } from "./db";
import type { Config } from "./config";
import type { ServerWebSocket } from 'bun';
import type { WSContext } from 'hono/ws';

declare module "bun" {
    interface Env {
        TURSO_API_TOKEN: string;
        TURSO_DB_URL: string;
        TURSO_DB_TOKEN: string;
        PORT?: number;
    }
}

export type SocketData = { id: string; user: User | null; };
export type SocketContext = WSContext & { raw: ServerWebSocket<SocketData>; };
export type IncomingEvent = "chat:join-room" | "chat:leave-room" | "chat:message" | "chat:typing";
export type OutgoingEventType = "welcome" | "chat:new-user" | "chat:user-left" | "chat:message" | "chat:typing";
export type WSMessage<T = unknown> = { type: IncomingEvent; data: T; };

export type HonoContext = {
    Variables: {
        turso: TursoClient;
        db: PrimaryDB;
        config: Config;
        lucia: Lucia;
        user: User | null;
        session: Session | null;
        oauth: OAuthHandlerMap;
    };
};

export type UserRole = "user" | "admin";
export type OAuthProvider = "github" | "google";

