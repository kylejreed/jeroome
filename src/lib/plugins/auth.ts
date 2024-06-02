import { type MiddlewareHandler } from "hono";

export type AuthHandler<TokenInfo extends object = {}, User = unknown> = {
  sign: (tokenInfo: TokenInfo) => string;
  getToken: (request: Request) => string | null;
  verify: (token: string) => Promise<User | null>;
};

export const authentication = <TokenInfo extends object = {}, User = unknown>(handler: AuthHandler<TokenInfo, User>): MiddlewareHandler => {
  return async (c, next) => {
    const token = handler.getToken(c.req.raw);
    const user = token ? await handler.verify(token) : null;
    c.set("token", token);
    c.set("user", user);
    c.set("auth", { sign: handler.sign });
    return await next();
  };
};

export const secured = (): MiddlewareHandler => {
  return async (c, next) => {
    const user = c.var.user;
    if (!user) {
      throw new Error("auth required");
    }
    return await next();
  };
};
