import { Hono } from 'hono';
import API from './api';
import { appContext } from './middleware/context';

const server = new Hono();

// Middleware
server.use(appContext);

// Routes
server.route("/api", API);

export default server;
