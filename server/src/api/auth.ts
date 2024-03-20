import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { generateId } from "lucia";
import { z } from "zod";

import { type HonoContext, type OAuthProvider } from "@types";
import { schema } from "@db";
import { requiresAuth } from "middleware/auth";
import { HTTPException } from "hono/http-exception";

const validation = {
    register: zValidator('json', z.object({ username: z.string(), password: z.string(), info: z.object({ email: z.string().optional(), name: z.string().optional() }).optional() })),
    login: zValidator('json', z.object({ username: z.string(), password: z.string() })),
};

const AuthRouter = new Hono<HonoContext>();

// Routes

// GET
AuthRouter.get("/whoami", requiresAuth, c => {
    const user = c.var.user!;
    return c.json({ ...user });
});

AuthRouter.get("/login/:provider", async (c) => {
    const provider = c.req.param("provider") as OAuthProvider;
    if (!c.var.oauth[provider]) {
        return c.text("Invalid provider", 400);
    }
    return await c.var.oauth[provider].redirect(c);
});

AuthRouter.get("/login/:provider/callback", async (c) => {
    const stateCookie = getCookie(c, "github_oauth_state");
    const url = new URL(c.req.url);

    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    if (!state || !stateCookie || !code || stateCookie !== state) {
        return c.body(null, 400);
    }

    const provider = c.req.param("provider") as OAuthProvider;
    const user = await c.var.oauth[provider].callback(c, code);
    if (user) {
        const session = await c.var.lucia.createSession(user.id, { email: user.email, role: user.role });
        const cookie = c.var.lucia.createSessionCookie(session.id);
        setCookie(c, cookie.name, cookie.value, cookie.attributes as any);
        return c.json({
            success: true,
            userId: user.id,
            token: session.id
        });
    }
    return c.body(null, 400);
});

// POST
AuthRouter.post("/register", validation.register, async (c) => {
    const body = c.req.valid('json');

    const hash = await Bun.password.hash(body.password);
    const userId = generateId(15);
    await c.var.db.insert(schema.users).values({
        id: userId,
        username: body.username,
        password: hash,
        email: body.info?.email,
        name: body.info?.name,
        role: "user"
    });

    const session = await c.var.lucia.createSession(userId, { username: body.username, email: body.info?.email, role: "user" });
    const cookie = c.var.lucia.createSessionCookie(session.id);
    setCookie(c, cookie.name, cookie.value, cookie.attributes as any);
    return c.json({
        success: true,
        userId,
        token: session.id
    });
});

AuthRouter.post("/login", validation.login, async (c) => {
    const body = c.req.valid('json');
    const user = await c.var.db.query.users.findFirst({ where: (users, { eq }) => eq(users.username, body.username) });
    if (!user) {
        throw new HTTPException(401, { message: "Invalid credentials" });
    }
    const valid = await Bun.password.verify(body.password, user.password!);
    if (!valid) {
        throw new HTTPException(401, { message: "Invalid credentials" });
    }
    const session = await c.var.lucia.createSession(user.id, { username: user.username, email: user.email, role: "user" });
    const cookie = c.var.lucia.createSessionCookie(session.id);
    setCookie(c, cookie.name, cookie.value, cookie.attributes as any);
    return c.json({
        success: true,
        userId: user.id,
        token: session.id
    });
});

export default AuthRouter;
