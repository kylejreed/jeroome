import { Hono } from "hono";

import AuthRouter from "./auth";
import UsersRouter from "./users";
import StocksRouter from "./stocks";
import MatchmakingRouter from "./matchmaking";

const API = new Hono();

// Routes
API.route("/", AuthRouter);
API.route("/users", UsersRouter);
API.route("/stocks", StocksRouter);
API.route("/matchmaking", MatchmakingRouter);

export default API;
