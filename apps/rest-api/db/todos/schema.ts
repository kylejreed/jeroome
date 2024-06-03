import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey().notNull(),
  text: text("email").unique().notNull(),
  createdAt: integer("id", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`),
  completedAt: integer("id", { mode: "timestamp" }),
});

export type Todo = (typeof todos)["$inferSelect"];
export type TodoInsert = (typeof todos)["$inferInsert"];
export type TodoUpdate = Partial<Omit<Todo, "id">>;
