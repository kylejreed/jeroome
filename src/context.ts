import type { Context as HonoContext } from "hono";
import type { DB } from "./db";
import type { Env } from "./config";

export type UserTokenInfo = { id: number; email: string };
export type AppContext = {
  db: DB;
  env: Env;
  user?: UserTokenInfo;
  token?: string;
  auth: { sign: (u: UserTokenInfo) => string };
};
export type Context = HonoContext<{ Variables: AppContext }>;
