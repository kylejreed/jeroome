import { DrizzleSQLiteAdapter, type SQLiteSessionTable, type SQLiteUserTable } from "@lucia-auth/adapter-drizzle";
import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import { Lucia, verifyRequestOrigin, Cookie } from "lucia";
import { type AuthHandler } from "../plugins/auth";
import type { Context } from "elysia";

export type { Session } from "lucia";

declare module "lucia" {
  interface Register {
    UserId: number;
  }
}

export const lucia = (db: BaseSQLiteDatabase<any, any>, sessionTable: SQLiteSessionTable, userTable: SQLiteUserTable): AuthHandler<string> => {
  const l = new Lucia(new DrizzleSQLiteAdapter(db, sessionTable, userTable), {});
  return {
    sign: (sessionId) => `Bearer ${sessionId}`,
    validate: async (c) => {
      const { usingCookieAuth, user, session } = await cookieAuth(c, l);
      return usingCookieAuth ? { user, session } : await bearerAuth(c, l);
    },
  };
};

async function cookieAuth({ request, cookie }: Context, lucia: Lucia) {
  // CSRF check
  if (request.method !== "GET") {
    const originHeader = request.headers.get("Origin");
    // NOTE: You may need to use `X-Forwarded-Host` instead
    const hostHeader = request.headers.get("Host");
    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
      return {
        user: null,
        session: null,
      };
    }
  }

  // use headers instead of Cookie API to prevent type coercion
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return { usingCookieAuth: false };
  }

  const sessionId = lucia.readSessionCookie(cookieHeader);
  if (!sessionId) {
    return {
      usingCookieAuth: true,
      user: null,
      session: null,
    };
  }

  const { session, user } = await lucia.validateSession(sessionId);
  let sessionCookie: Cookie | undefined;
  if (session && session.fresh) {
    sessionCookie = lucia.createSessionCookie(session.id);
    cookie[sessionCookie.name].set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    });
  }
  if (!session) {
    sessionCookie = lucia.createBlankSessionCookie();
    cookie[sessionCookie.name].set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    });
  }

  return { usingCookieAuth: true, user, session };
}

async function bearerAuth(c: Context, lucia: Lucia) {
  const authorization = c.request.headers.get("Authorization");
  const sessionId = lucia.readBearerToken(authorization ?? "");

  if (!sessionId) {
    return { user: null, session: null };
  }
  return lucia.validateSession(sessionId);
}
