import Elysia from "elysia";

export type AuthHandler<TokenInfo extends object = {}, User = unknown> = {
  sign: (tokenInfo: TokenInfo) => string;
  getToken: (request: Request) => string | null;
  verify: (token: string) => Promise<User | null>;
};

export const authentication = <TokenInfo extends object = {}, User = unknown>(handler: AuthHandler<TokenInfo, User>) => {
  return new Elysia({ name: "@leserver/authentication" }).derive({ as: "scoped" }, async (c) => {
    const token = handler.getToken(c.request);
    const user = token ? await handler.verify(token) : null;
    return {
      token,
      user,
      auth: { sign: handler.sign },
    };
  });
};
