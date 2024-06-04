import { Http, Auth, Plugin } from "@leserver";
import db from "./db";
import * as Routes from "./routes";
import type { AppContext, UserTokenInfo } from "./context";

// const jwt = Auth.jwt({
//   secret: "supersecret",
//   getUser: (token: UserTokenInfo) => db.users.findOne({ id: token.id }),
//   encodeValues: (user) => ({ id: user.id, email: user.email }),
// });

const auth = Auth.lucia(db.client as any, db.sessions, db.users.schema);

const server = Http.server<AppContext>({ db });
server.use(Plugin.logger());
server.use(Plugin.authentication(auth));
server.get("/", () => "hi");

server.use(Routes.AuthRouter);
server.use(Routes.TodoRouter);

export default server;
