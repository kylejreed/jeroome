import { Hono } from 'hono';
import API from './api';
import WebSocketRouter, { websocket } from './ws';
import { parseSession, appContext } from './middleware';
import type { HonoContext } from '@types';

const server = new Hono<HonoContext>();

// Middleware
server.use(appContext);
server.use(parseSession);

// Routes
server.route("/api", API);
server.route("/ws", WebSocketRouter);
server.get("/", c => c.text(`Welcome, ${c.var.user?.name ?? "anon"}!`));

export { websocket };
export default server;
