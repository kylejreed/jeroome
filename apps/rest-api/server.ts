import { Http, Auth, Plugin } from "@leserver";
import db from "./db";
import * as Routes from "./routes";
import type { AppContext } from "./context";

const auth = Auth.lucia(db.client as any, db.sessions, db.users.schema);

const server = Http.server<AppContext>({ db });
server.use(Plugin.logger());
server.use(Plugin.authentication(auth));
server.get("/", () => "hi");

server.use(Routes.AuthRouter);
server.use(Routes.TodoRouter);
server.use(Routes.TimerRouter);

export default server;
