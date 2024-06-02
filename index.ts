import { env } from "~/config";
import server from "~/server";

const app = Bun.serve({
  port: +env.PORT,
  fetch: server.fetch,
});

console.log(`Server running at: ${app.url} 🚀`);
