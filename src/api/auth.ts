import db from "~/db";

import type { AppContext, Context } from "../context";
import type { Routes } from "~/lib/types";

export default {
  "POST /register": async (c: Context) => {
    const body = await c.req.json<{ email: string }>();
    const newUser = db.users.create({ email: body.email }, true);
    if (!newUser) throw new Error("nah");
    return c.json({ token: c.var.auth.sign(newUser) });
  },
  "POST /login": async (c) => {
    const body = await c.req.json<{ email: string }>();
    const user = db.users.findOne({ email: body.email });
    return c.json({ token: c.var.auth.sign(user) });
  },
  "GET /whoami": async (c) => {
    const userId = c.var.user!.id;
    const user = db.users.findOne({ id: userId });
    return c.json({ user });
  },
} as Routes<AppContext>;
