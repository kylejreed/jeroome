import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { generateId } from "lucia";
import { z } from "zod";

import { type HonoContext } from "@types";
import { schema } from "@db";
import { requiresAuth } from "middleware/auth";

const validation = {
    register: zValidator('json', z.object({ email: z.string().email(), password: z.string() })),
    login: zValidator('json', z.object({ email: z.string().email(), password: z.string() }))
};

const AuthRouter = new Hono<HonoContext>();

// Routes
AuthRouter.get("/whoami", requiresAuth, c => {
    const user = c.var.user!;
    return c.json({ ...user });
});

AuthRouter.post("/register", validation.register, async (c) => {
    const body = c.req.valid('json');

    const hash = await Bun.password.hash(body.password);
    const userId = generateId(15);
    await c.var.db.insert(schema.users).values({
        id: userId,
        email: body.email,
        password: hash,
        role: "user"
    });

    const session = await c.var.lucia.createSession(userId, { email: body.email, role: "user" });
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
    const user = await c.var.db.query.users.findFirst({ where: (users, { eq }) => eq(users.email, body.email) });
    if (!user) {
        throw new Error('no user');
    }
    const valid = await Bun.password.verify(body.password, user.password!);
    if (!valid) {
        throw new Error('invalid credentials');
    }
    const session = await c.var.lucia.createSession(user.id, { email: body.email, role: "user" });
    const cookie = c.var.lucia.createSessionCookie(session.id);
    setCookie(c, cookie.name, cookie.value, cookie.attributes as any);
    return c.json({
        success: true,
        userId: user.id,
        token: session.id
    });
});

export default AuthRouter;
