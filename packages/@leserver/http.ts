import { Elysia, type Context as ElysiaContext, type RouteSchema, type SingletonBase } from "elysia";
import { swagger } from "@elysiajs/swagger";

export { t } from "elysia";

type Rec = Record<string, any>;
type LeServerAddons = {
  run: (port: number, opts: { debug: boolean; documentation?: { info?: { title: string; description: string; version: string } } }) => void;
  router: <T extends string, C extends Rec>(prefix: T) => AppRouter<T, Context<C>>;
};

export type AppRouter<Path extends string, Context extends Rec, Derive extends Rec = {}> = Elysia<Path, false, ServerContext<Context, Derive>> &
  Pick<LeServerAddons, "router">;
export type AppServer<Context extends Rec> = Elysia<"", false, ServerContext<Context, {}>> & LeServerAddons;
export type AppEnv<T extends Rec> = { Variables: T };
export type Context<in out Decorator extends Rec = {}, in out Route extends RouteSchema = {}, in out Derive extends Rec = {}> = ElysiaContext<
  Route,
  ServerContext<Decorator, Derive>
>;

interface ServerContext<Decorator extends Rec = {}, Derive extends Rec = {}> extends SingletonBase {
  decorator: Decorator;
  derive: Derive;
}

export const server = <Context extends Record<string, any>>(context: Partial<Context>) => {
  const app = new Elysia<"", false, ServerContext<Context>>();
  if (context) {
    Object.entries(context ?? {}).forEach(([k, v]) => app.decorate(k, v));
  }

  const routers: Elysia<any, false, ServerContext<Context>>[] = [];
  const createRouter = <Path extends string>(path: Path) => {
    const r = new Elysia<Path, false, ServerContext<Context>>({ prefix: path });
    routers.push(r);
    Object.assign(r, { createRouter });
    return r as AppRouter<Path, Context>;
  };

  const run: LeServerAddons["run"] = (port: number, opts) => {
    app.use(swagger({ path: "/swagger", documentation: opts.documentation }));
    routers.forEach((r) => app.use(r));
    app.listen(port, (s) => {
      console.log(`🚀 Server listening at: ${s.url}`);
      if (opts?.debug) {
        console.log("Routes:");
        const routes = app.routes.reduce<Record<string, string[]>>((acc, r) => {
          const path = r.path;
          acc[path] ??= [];
          acc[path].push(r.method);
          return acc;
        }, {});

        Object.keys(routes)
          .sort()
          .forEach((path) => console.log(path, `[${routes[path].join(",")}]`));
      }
    });
  };

  Object.assign(app, { run, createRouter });
  return app as AppServer<Context>;
};

export const router = <Context extends Record<string, any>, Path extends string>(prefix: Path) => {
  const app = new Elysia<Path, false, ServerContext<Context>>({ prefix });
  return app as AppRouter<Path, Context>;
};
