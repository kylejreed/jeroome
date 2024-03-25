import { Hono } from 'hono';
import API from './api';
import WebSocketRouter, { websocket } from './ws';
import { parseSession, appContext } from './middleware';
import type { HonoContext } from '@types';
import { HTTPException } from 'hono/http-exception';
import { ZodDefault, ZodError } from 'zod';

const server = new Hono<HonoContext>();

// Middleware
server.use(appContext);
server.use(parseSession);

// Routes
server.route("/api", API);
server.route("/ws", WebSocketRouter);
server.get("/", c => c.text(`Welcome, ${c.var.user?.name ?? "anon"}!`));

server.onError((err, c) => {
    if (err instanceof HTTPException) {
        return err.getResponse();
    }
    if (err instanceof ZodError) {
        return c.json(err, 400);
    }
    return c.json({
        message: "Something went wrong",
        error: err,
    }, 500);
});

export { websocket };
export default server;
