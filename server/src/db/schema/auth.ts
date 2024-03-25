import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name"),
    username: text("username").unique().notNull(),
    email: text("email"),
    password: text("password"),
    role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
    oauth_provider: text("oauth_provider"),
    oauth_id: text("oauth_id")
});

export const sessions = sqliteTable("user_session", {
    id: text("id").notNull().primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: integer("expires_at").notNull()
});


export type User = typeof users.$inferSelect;
export type CreateUser = typeof users.$inferInsert;

export const insertUserSchema = createInsertSchema(users, {
    password: z.string().min(6, "Password must be at least 6 characters").regex(/\d/, "Password must contain at least one number"),
    email: z.string().email()
});
export const selectUserSchema = createSelectSchema(users).omit({ password: true });
