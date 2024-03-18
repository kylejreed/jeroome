import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name"),
    username: text("username").unique().notNull(),
    email: text("email"),
    password: text("password"),
    role: text("role").default("user"),
    oauth_provider: text("oauth_provider"),
    oauth_id: text("oauth_id")
});

export const sessions = sqliteTable("user_session", {
    id: text("id").notNull().primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id),
    expiresAt: integer("expires_at").notNull()
});


export type User = typeof users.$inferSelect;
export type CreateUser = typeof users.$inferInsert;
