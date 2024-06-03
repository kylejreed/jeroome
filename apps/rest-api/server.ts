import { Http, Auth, Plugin } from "@leserver";

import db from "./db";
import * as api from "./api";
import type { UserTokenInfo } from "./context";

const jwt = Auth.jwt({
  secret: "supersecret",
  getUser: (token: UserTokenInfo) => db.users.findOne({ id: token.id }),
  encodeValues: (user) => ({ id: user.id, email: user.email }),
});

const server = Http.server({ db });
server.use(Plugin.authentication(jwt));
server.get("/", () => "hi");
server.get("/whoami", api.whoami);
server.post("/login", api.loginUser);
server.post("/register", api.registerUser);

const TodoRouter = server.createRouter("/todos");
TodoRouter.get("/", api.getAllTodos);

export default server;
