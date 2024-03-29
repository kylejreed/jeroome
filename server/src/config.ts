import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const env = createEnv({
    server: {
        PORT: z.number().optional(),
        LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]),
        DATABASE_CONNECTION_TYPE: z.enum(["test", "local", "remote", "local-replica"]),
        DATABASE_URL: z.string().min(1),
        DATABASE_AUTH_TOKEN: z
            .string()
            .optional()
            .refine((s) => {
                // not needed for local only
                const type = Bun.env.DATABASE_CONNECTION_TYPE;
                return type === "remote" || type === "local-replica"
                    ? s && s.length > 0
                    : true;
            }),
        NODE_ENV: z.enum(["development", "production", "test"]),
        TURSO_API_KEY: z.string().min(1),
        TURSO_ORG_SLUG: z.string().min(1),
        GITHUB_CLIENT_ID: z.string().optional(),
        GITHUB_CLIENT_SECRET: z.string().optional(),
        STOCK_API_KEY: z.string().optional(),
        GOOGLE_CLIENT_ID: z.string(),
        GOOGLE_CLIENT_SECRET: z.string(),
        GOOGLE_REDIRECT_URI: z.string(),
        HUGGING_FACE_ACCESS_TOKEN: z.string().optional()
    },
    runtimeEnv: process.env,
});

const args = {
    // watch: process.argv.includes("--watch"),
    // liveReload: true,
};

export const config = {
    env,
    args,
};

export type Config = typeof config;

