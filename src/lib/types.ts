import type { Env, Handler } from "hono";

export type Handlers<T extends Env["Variables"] = {}> = Handler<{ Variables: T }> | Handler<{ Variables: T }>[];
export type RouteHandler<T extends Env["Variables"] = {}> = Handlers<T> | { [property: string]: RouteHandler<T> };
export type Routes<T extends Env["Variables"] = {}> = Record<string, RouteHandler<T>>;
