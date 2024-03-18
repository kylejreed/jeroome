import { createClient, type Config } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { config } from "@config";
import schema from "./schema";

const { DATABASE_CONNECTION_TYPE } = config.env;

const options = {
    local: { url: "file:local.sqlite" },
    remote: {
        url: config.env.DATABASE_URL,
        authToken: config.env.DATABASE_AUTH_TOKEN!,
    },
    "local-replica": {
        url: "file:local.sqlite",
        syncUrl: config.env.DATABASE_URL,
        authToken: config.env.DATABASE_AUTH_TOKEN!,
    },
} satisfies Record<typeof DATABASE_CONNECTION_TYPE, Config>;

export const client = createClient(options[DATABASE_CONNECTION_TYPE]);

if (config.env.DATABASE_CONNECTION_TYPE === "local-replica") {
    await client.sync();
}

const db = drizzle(client, { schema, logger: true });

export type PrimaryDB = typeof db;
export { schema };
export default db;
