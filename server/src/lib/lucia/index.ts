import { Lucia } from 'lucia';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import db, { schema } from "@db";
import type { UserRole } from 'types';

const adapter = new DrizzleSQLiteAdapter(db, schema.sessions, schema.users);
export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === "production"
        }
    },
    getUserAttributes(attr) {
        return {
            email: attr.email,
            role: attr.role
        };
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            email: string;
            role: UserRole;
        };
    }
}

