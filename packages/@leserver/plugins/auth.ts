import Elysia, { type Context } from "elysia";
import type { Session } from "lucia";

export type AuthHandler<TokenInfo = {}, User = unknown> = {
  sign: (tokenInfo: TokenInfo) => string;
  validate: (c: Context) => Promise<{ user: User | null; session?: Session | null }>;
};

export const authentication = <TokenInfo = {}, User = unknown>(handler: AuthHandler<TokenInfo, User>) => {
  return new Elysia({ name: "@leserver/authentication" }).derive({ as: "scoped" }, async (c) => {
    const { user, session } = await handler.validate(c);
    return {
      user,
      session,
      auth: { sign: handler.sign },
    };
  });
};
