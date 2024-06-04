import { Config } from "@leserver";
import server from "./server";

const env = Config.createEnv((z) => ({
  PORT: z.string().default("3000"),
}));

server.run(+env.PORT, {
  debug: true,
  documentation: { info: { title: "@Leserver API", description: "API created using @Leserver utils", version: "0.0.1" } },
});
