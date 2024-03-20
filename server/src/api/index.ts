import { Hono } from "hono";

import AuthRouter from "./auth";
import UsersRouter from "./users";
import StocksRouter from "./stocks";

const API = new Hono();

// Routes
API.route("/", AuthRouter);
API.route("/users", UsersRouter);
API.route("/stocks", StocksRouter);

export default API;
