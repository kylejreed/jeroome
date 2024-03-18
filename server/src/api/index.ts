import { Hono } from "hono";

import AuthRouter from "./auth";
import UsersRouter from "./users";

const API = new Hono();

// Routes
API.route("/", AuthRouter);
API.route("/users", UsersRouter);

export default API;
