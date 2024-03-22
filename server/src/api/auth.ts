import { Hono, type Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { generateId } from "lucia";
import { z } from "zod";

import { type HonoContext, type OAuthProvider } from "@types";
import { schema } from "@db";
import { requiresAuth } from "middleware/auth";
import { HTTPException } from "hono/http-exception";
import { and, eq } from "drizzle-orm";
import type { CreateUser, User } from "@db/schema/auth";

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
    const url = await c.var.oauth[provider].getRedirectUrl(state => {
        setCookie(c, "oauth_state", state, {
            httpOnly: true,
            secure: c.var.config.env.NODE_ENV === "production",
            maxAge: 60 * 10, // 10 minutes
            path: "/"
        });
    });

    return c.redirect(url);
});

AuthRouter.get("/login/:provider/callback", async (c) => {
    const stateCookie = getCookie(c, "oauth_state");
    const url = new URL(c.req.url);

    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    if (!state || !stateCookie || !code || stateCookie !== state) {
        return c.body(null, 400);
    }

    const provider = c.req.param("provider") as OAuthProvider;
    const oauthUser = await c.var.oauth[provider].callback(c, code);
    if (oauthUser) {
        let [appUser] = await c.var.db
            .select()
            .from(schema.users)
            .where(and(eq(schema.users.oauth_provider, provider), eq(schema.users.oauth_id, oauthUser.id)));

        if (!appUser) {
            appUser = await createNewUser(c, {
                username: oauthUser.email,
                email: oauthUser.email,
                name: oauthUser.name,
                oauth_provider: provider,
                oauth_id: oauthUser.id,
            });
        }

        return handleLoginSuccess(c, appUser);
    }
    return c.body(null, 400);
});

// POST
AuthRouter.post("/register", validation.register, async (c) => {
    const body = c.req.valid('json');

    const user = await createNewUser(c, {
        username: body.username,
        password: body.password,
        email: body.info?.email,
        name: body.info?.name,
    });

    return await handleLoginSuccess(c, user);
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

    return await handleLoginSuccess(c, user);
});

// Helper functions
async function createNewUser(c: Context<HonoContext>, data: Omit<CreateUser, "id" | "role">) {
    if (data.password) {
        data.password = await Bun.password.hash(data.password);
    }
    const userId = generateId(15);
    const [user] = await c.var.db.insert(schema.users).values({
        ...data,
        id: userId,
        role: "user"
    }).returning();
    return user;
}

async function handleLoginSuccess(c: Context<HonoContext>, user: User) {
    const session = await c.var.lucia.createSession(user.id, { username: user.username, email: user.email, role: "user" });
    const cookie = c.var.lucia.createSessionCookie(session.id);
    setCookie(c, cookie.name, cookie.value, cookie.attributes as any);
    return c.json({
        success: true,
        userId: user.id,
        token: session.id
    });
}

export default AuthRouter;
