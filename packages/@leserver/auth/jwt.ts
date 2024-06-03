import { sign, verify } from "jsonwebtoken";
import { type AuthHandler } from "../plugins/auth";

type JwtAuthOpts<TokenInfo = {}, User = {}> = {
  secret: string;
  getUser: (info: TokenInfo) => User | Promise<User>;
  encodeValues: (user: User) => TokenInfo;
};
export const jwt = <TokenInfo = {}, User = {}>({ secret, getUser }: JwtAuthOpts<TokenInfo, User>): AuthHandler => ({
  sign: (user) => sign(user, secret),
  getToken: (req) => {
    const authorization = req.headers.get("Authorization");
    return authorization?.startsWith("Bearer ") ? authorization.split(" ")[1] : null;
  },
  verify: async (token) => {
    const info = verify(token, secret);
    return await getUser(info as TokenInfo);
  },
});
