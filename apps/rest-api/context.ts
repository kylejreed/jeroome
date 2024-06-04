import type { Context as HttpContext } from "@leserver/http";
import type { DB } from "./db";
import type { Env } from "./config";
import type { User } from "db/schema";

export type UserTokenInfo = { id: number; email: string };
export type AppContext = {
  db: DB;
  env: Env;
  user?: User;
  token?: string;
  auth: { sign: (u: User) => string };
};
export type Context = HttpContext<AppContext>;
