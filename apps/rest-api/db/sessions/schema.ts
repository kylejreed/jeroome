import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "../users/schema";

export const sessions = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});

export type Session = (typeof sessions)["$inferSelect"];
export type SessionInsert = (typeof sessions)["$inferInsert"];
export type SessionUpdate = Partial<Omit<Session, "id">>;
