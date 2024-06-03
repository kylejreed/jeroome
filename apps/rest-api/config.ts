import { Config } from "@leserver";

export const env = Config.createEnv((z) => ({
  PORT: z.string().default("3000"),
}));

export type Env = typeof env;
