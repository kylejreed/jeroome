import { Http, Auth, Plugin } from "@leserver";
import db from "./db";
import * as API from "./api";
import type { AppContext, UserTokenInfo } from "./context";

const jwt = Auth.jwt({
  secret: "supersecret",
  getUser: (token: UserTokenInfo) => db.users.findOne({ id: token.id }),
  encodeValues: (user) => ({ id: user.id, email: user.email }),
});

const server = Http.server<AppContext>({ db });
server.use(Plugin.authentication(jwt));
server.get("/", () => "hi");
server.get("/whoami", API.auth.whoami, {
  beforeHandle: ({ user, error }) => !user && error(403, "Need some auth bud"),
});
server.post("/login", API.auth.loginUser);
server.post("/register", API.auth.registerUser);
server.use(API.TodoRouter);

export default server;
