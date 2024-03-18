import { createMiddleware } from "hono/factory";
import type { HonoContext, UserRole } from "@types";
import { getCookie, setCookie } from "hono/cookie";

export const parseSession = createMiddleware<HonoContext>(async (c, next) => {
    let sessionId: string | null = getCookie(c, c.var.lucia.sessionCookieName) ?? null;
    if (!sessionId) {
        const authorizationHeader = c.req.header("Authorization");
        sessionId = c.var.lucia.readBearerToken(authorizationHeader ?? "");
    }

    if (!sessionId) {
        c.set("session", null);
        c.set("user", null);
        return next();
    }

    const { session, user } = await c.var.lucia.validateSession(sessionId);
    if (session && session.fresh) {
        setCookie(c, "Set-Cookie", c.var.lucia.createSessionCookie(session.id).serialize());
    }
    c.set("session", session);
    c.set("user", user);
    return next();
});

export const requiresAuth = createMiddleware<HonoContext>(async (c, next) => {
    if (!c.var.user) {
        c.body(null, 401);
        return;
    }

    await next();
});


export const requiresRoles = (...roles: UserRole[]) => {
    return createMiddleware<HonoContext>(async (c, next) => {
        if (!c.var.user) {
            c.body(null, 401);
            return;
        }

        if (roles.length > 0 && !roles.includes(c.var.user.role)) {
            c.body(null, 403);
            return;
        }
        await next();
    });
}

