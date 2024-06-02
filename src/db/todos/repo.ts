import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

import { Repo } from "~/lib";
import { todos, type Todo, type TodoInsert, type TodoUpdate } from "./schema";

export class TodosRepo extends Repo.SqliteRepo<Todo, TodoInsert, TodoUpdate, { id: number }> {
  constructor(db: BunSQLiteDatabase<any>) {
    super(db, todos);
  }
}
