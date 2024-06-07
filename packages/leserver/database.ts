import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { Database } from "bun:sqlite";

export const sqlite = async <T extends Record<string, any>>(name: string, schema: T, opts?: { migrationsFolder?: string }) => {
  const sqlite = new Database(name);
  const db = drizzle(sqlite, { schema });
  if (opts?.migrationsFolder) {
    migrate(db, { migrationsFolder: opts.migrationsFolder });
  }

  return db;
};
