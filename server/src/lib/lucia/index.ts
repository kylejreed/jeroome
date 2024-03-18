import { Lucia } from 'lucia';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import db, { schema } from "@db";
import type { OAuthProvider, UserRole } from 'types';

const adapter = new DrizzleSQLiteAdapter(db, schema.sessions, schema.users);
export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === "production"
        }
    },
    getUserAttributes(attr) {
        return {
            name: attr.name,
            username: attr.username,
            email: attr.email,
            role: attr.role,
            oauth_provider: attr.oauth_provider,
            oauth_id: attr.oauth_id
        };
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: {
            name: string;
            username: string;
            email: string;
            role: UserRole;
            oauth_provider?: OAuthProvider;
            oauth_id?: string | number;
        };
    }
}

