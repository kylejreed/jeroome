import server from "./src/server";
import { config } from "@config";

const app = Bun.serve({
    port: config.env.PORT ?? 3000,
    fetch: server.fetch
});

console.clear();
console.log(`🚀 Server running at: ${app.url.toString()}`);
