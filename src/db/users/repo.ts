import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

import { Repo } from "~/lib";
import { users, type User, type UserInsert, type UserUpdate } from "./schema";

export class UsersRepo extends Repo.SqliteRepo<User, UserInsert, UserUpdate, { id: numbek } | { email: string }> {
  constructor(db: BunSQLiteDatabase<any>) {
    super(db, users);
  }
}
