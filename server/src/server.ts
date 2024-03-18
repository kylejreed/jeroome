import { Hono } from 'hono';
import API from './api';
import { parseSession, appContext } from './middleware';
import type { HonoContext } from '@types';

const server = new Hono<HonoContext>();

// Middleware
server.use(appContext);
server.use(parseSession);

// Routes
server.route("/api", API);
server.get("/", c => c.text(`Welcome, ${c.var.user?.name ?? "anon"}!`));

export default server;
