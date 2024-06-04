import { sign, verify } from "jsonwebtoken";
import { type AuthHandler } from "../plugins/auth";

type JwtAuthOpts<TokenInfo = {}, User = {}> = {
  secret: string;
  getUser: (info: TokenInfo) => User | Promise<User>;
  encodeValues: (user: User) => TokenInfo;
};
export const jwt = <TokenInfo = {}, User = {}>({ secret, getUser }: JwtAuthOpts<TokenInfo, User>): AuthHandler => ({
  sign: (user) => sign(user, secret),
  validate: async ({ request }) => {
    const authorization = request.headers.get("Authorization");
    const token = authorization?.startsWith("Bearer ") ? authorization.split(" ")[1] : null;
    if (!token) {
      return { user: null, session: null };
    }

    const info = verify(token, secret);
    const user = await getUser(info as TokenInfo);
    return {
      user,
      session: {
        id: "jwt",
        fresh: false,
        userId: 1,
        expiresAt: new Date("3000-01-01"),
      },
    };
  },
});
