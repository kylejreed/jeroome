import type { Lucia, Session, User } from 'lucia';

import type { TursoClient } from "./lib/turso";
import type { OAuthHandlerMap } from './lib/lucia/oauth';
import type { PrimaryDB } from "./db";
import type { Config } from "./config";

declare module "bun" {
    interface Env {
        TURSO_API_TOKEN: string;
        TURSO_DB_URL: string;
        TURSO_DB_TOKEN: string;
        PORT?: number;
    }
}

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
export type OAuthProvider = "github";

