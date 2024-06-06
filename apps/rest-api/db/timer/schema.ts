import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const timer = sqliteTable("timer", {
  id: integer("id").notNull().primaryKey(),
  label: text("label").notNull(),
  startedAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),
  endedAt: integer("expires_at", { mode: "timestamp_ms" }),
});

export type Timer = (typeof timer)["$inferSelect"];
export type TimerInsert = (typeof timer)["$inferInsert"];
export type TimerUpdate = Partial<Omit<Timer, "id" | "startedAt">>;
