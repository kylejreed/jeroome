import { Database } from "~/lib";

import { TodosRepo } from "./todos/repo";
import { UsersRepo } from "./users/repo";
import { schema } from "./schema";

const dbInstance = await Database.sqlite("data.db", schema);

const db = {
  users: new UsersRepo(dbInstance),
  todos: new TodosRepo(dbInstance),
};

export type DB = typeof db;
export default db;
