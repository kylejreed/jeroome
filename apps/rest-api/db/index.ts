import { Database } from "@leserver";

import { TodosRepo } from "./todos/repo";
import { UsersRepo } from "./users/repo";
import { schema } from "./schema";

const dbInstance = await Database.sqlite("data.db", schema, { migrationsFolder: "./drizzle" });

const db = {
  client: dbInstance,
  users: new UsersRepo(dbInstance),
  todos: new TodosRepo(dbInstance),
  sessions: schema.sessions,
};

export { schema };
export type Schema = typeof schema;

export type DB = typeof db;
export default db;
