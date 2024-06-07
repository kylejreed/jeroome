import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

import { Repo } from "leserver";
import { users, type User, type UserInsert, type UserUpdate } from "./schema";

export class UsersRepo extends Repo.SqliteRepo<User, UserInsert, UserUpdate, { id: number } | { email: string }> {
  constructor(db: BunSQLiteDatabase<any>) {
    super(db, users);
  }
}
