import { HttpServer, Auth, Plugin } from "~/lib";

import db from "./db";
import { AuthRoutes, TodoRoutes } from "./api";
import type { AppContext, UserTokenInfo } from "./context";

const jwt = Auth.jwt({
  secret: "supersecret",
  getUser: (token: UserTokenInfo) => db.users.findOne({ id: token.id }),
  encodeValues: (user) => ({ id: user.id, email: user.email }),
});

const server = HttpServer.create({
  debug: true,
  context: { db } as AppContext,
  plugins: [Plugin.logger(), Plugin.trimTrailingSlash(), Plugin.authentication(jwt)],
  routes: {
    "/": (c) => c.json(c.var.env.PORT),
    "/api": {
      ...AuthRoutes,
      "/todos": TodoRoutes,
    },
  },
  onError: (e, c) => c.text(e.message),
});

export default server;
