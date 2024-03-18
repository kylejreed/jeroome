import { Hono } from "hono";

import { parseSession } from "../middleware/auth";
import AuthRouter from "./auth";
import UsersRouter from "./users";

const API = new Hono();

// Middleware
API.use(parseSession);

// Routes
API.route("/", AuthRouter);
API.route("/users", UsersRouter);

export default API;
