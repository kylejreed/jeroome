import { Config } from "leserver";

export const env = Config.createEnv((z) => ({
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string(),
}));

export type Env = typeof env;
