import { createMiddleware } from "hono/factory";
import type { HonoContext } from "@types";
import { TursoClient } from "@lib/turso";
import db from "../db";
import { config } from "@config";
import { lucia } from "@lib/lucia";
import { oauthProviders } from "@lib/lucia/oauth";

const tursoClient = new TursoClient(Bun.env.TURSO_API_TOKEN);
export const appContext = createMiddleware<HonoContext>((c, next) => {
    c.set("turso", tursoClient);
    c.set("db", db);
    c.set("config", config);
    c.set("lucia", lucia);
    c.set("oauth", oauthProviders);
    return next();
})
