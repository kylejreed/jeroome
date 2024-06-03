import { Hono, type MiddlewareHandler, type NotFoundHandler, type ErrorHandler } from "hono";

type CreateServerOpts<Decorator extends Record<string, any>> = {
  debug?: boolean;
  context?: Decorator;
  plugins?: MiddlewareHandler[];
  routes?: Routes<Decorator>;
  onNotFound?: NotFoundHandler;
  onError?: ErrorHandler;
};

export const create = <Context extends Record<string, any>>({
  debug,
  context,
  plugins,
  routes,
  onError,
  onNotFound,
}: CreateServerOpts<Context> = {}) => {
  const app = new Hono<{ Variables: Context }>();
  if (context) {
    app.use(async (c, next) => {
      Object.entries(context ?? {}).forEach(([k, v]) => c.set(k, v));
      return await next();
    });
  }
  plugins?.forEach((p) => app.use(p));
  onError && app.onError(onError);
  onNotFound && app.notFound(onNotFound);

  const badRoutes = [];
  for (const [method, path, handler] of flattenRoutes(routes ?? {})) {
    switch (method) {
      case "GET":
        app.get(path, ...(Array.isArray(handler) ? handler : [handler]));
        break;
      case "POST":
        app.post(path, ...(Array.isArray(handler) ? handler : [handler]));
        break;
      case "PUT":
        app.put(path, ...(Array.isArray(handler) ? handler : [handler]));
        break;
      case "DELETE":
        app.delete(path, ...(Array.isArray(handler) ? handler : [handler]));
        break;
      case "*":
      case "ALL":
        app.all(path, ...(Array.isArray(handler) ? handler : [handler]));
        break;
      default:
        badRoutes.push([method, path]);
    }
  }
  if (badRoutes.length) {
    console.warn(`Unknown routes: ${badRoutes.map(([m, p]) => `${m} ${p}`).join("\r\n")}`);
  }
  if (debug) {
    showRoutes(app);
  }
  return app;
};

export const flattenRoutes = (routes: Routes<any>) => {
  const out: [string, string, Handlers<any>][] = [];
  const goThrough = (basePath: string, obj: any, baseMethod: string | undefined) => {
    for (const [route, handler] of Object.entries(obj ?? {})) {
      let method: string | undefined, path: string;
      const split = route.split(" ");
      if (split.length > 1) {
        method = split[0];
        path = split[1];
      } else {
        path = split[0];
      }

      const fullPath = `${basePath}${path}`.replace("//", "/");
      if (handler instanceof Function || Array.isArray(handler)) {
        out.push([method ?? baseMethod ?? "*", fullPath, handler as Handlers]);
        continue;
      } else {
        goThrough(fullPath, handler, method ?? baseMethod);
      }
    }
  };

  goThrough("", routes, undefined);
  return out;
};
