import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { generateId } from "lucia";
import { z } from "zod";

import { type HonoContext } from "@types";
import { schema } from "@db";
import { requiresRoles } from "middleware/auth";
import { eq } from "drizzle-orm";

const validation = {
    createUser: zValidator('json', z.object({ email: z.string().email(), password: z.string(), role: z.enum(["user", "admin"]) })),
};

const UsersRouter = new Hono<HonoContext>().use(requiresRoles("admin"));

// Routes
UsersRouter.post("/", validation.createUser, async (c) => {
    const body = c.req.valid('json');

    const hash = await Bun.password.hash(body.password);
    const userId = generateId(15);
    await c.var.db.insert(schema.users).values({
        id: userId,
        email: body.email,
        password: hash,
        role: "user"
    });

    return c.json({
        success: true,
        userId,
    });
});

UsersRouter.delete('/:id', async (c) => {
    const id = c.req.param("id");
    await c.var.db.delete(schema.users).where(eq(schema.users.id, id));

    return c.json({
        success: true
    });
});

export default UsersRouter;

