import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

const options = {
    local: { url: "file:local.sqlite" },
    remote: {
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_AUTH_TOKEN!,
    },
    "local-replica": {
        url: "file:local.sqlite",
        syncUrl: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_AUTH_TOKEN!,
    },
} as Record<string, any>;

const credentials = options[process.env.DATABASE_CONNECTION_TYPE ?? ""];

export default {
    schema: "./src/db/schema/*",
    out: "./drizzle",
    driver: 'libsql',
    dbCredentials: credentials
} satisfies Config;
