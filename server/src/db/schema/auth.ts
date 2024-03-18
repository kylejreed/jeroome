import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name"),
    email: text("email").unique().notNull(),
    password: text("password"),
    role: text("role").default("user")
});

export const sessions = sqliteTable("user_session", {
    id: text("id").notNull().primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id),
    expiresAt: integer("expires_at").notNull()
});

