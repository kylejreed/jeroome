import type { Server } from "bun";
import { Elysia, type Context as ElysiaContext, type SingletonBase } from "elysia";

type Rec = Record<string, any>;
export type AppRouter<Path extends string, Context extends Rec> = Elysia<Path, false, ServerContext<Context, {}>>;
export type AppServer<Context extends Rec> = Elysia<"", false, ServerContext<Context, {}>> & {
  run: (port: number, opts: { debug: boolean }) => Server;
  createRouter: <T extends string>(prefix: T) => AppRouter<T, Context>;
};
export type AppEnv<T extends Rec> = { Variables: T };
export type Context<Decorator extends Rec = {}, Derive extends Rec = {}> = ElysiaContext<{}, ServerContext<Decorator, Derive>>;

interface ServerContext<Decorator extends Rec = {}, Derive extends Rec = {}> extends SingletonBase {
  decorator: Decorator;
  derive: Derive;
}

export const server = <Context extends Record<string, any>>(context: Context) => {
  const app = new Elysia<"", false, ServerContext<Context>>();
  if (context) {
    Object.entries(context ?? {}).forEach(([k, v]) => app.decorate(k, v));
  }

  const routers: Elysia<any, false, ServerContext<Context>>[] = [];
  const createRouter = <Path extends string>(path: Path) => {
    const r = new Elysia<Path, false, ServerContext<Context>>({ prefix: path });
    routers.push(r);
    return r;
  };

  const run = (port: number, opts?: { debug: boolean }) => {
    routers.forEach((r) => app.use(r));
    if (opts?.debug) {
      console.log(app.routes.map((r) => `${r.method} ${r.path}`));
    }
    app.listen(port);
  };

  Object.assign(app, { run, createRouter });
  return app as AppServer<Context>;
};
