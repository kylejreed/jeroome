import db, { schema } from "@db";
import { generateId } from "lucia";

const hash = await Bun.password.hash("admin");
const userId = generateId(15);

const existingAdmin = await db.query.users.findFirst({ where: (users, { eq }) => eq(users.email, "admin@admin.com") });
if (!existingAdmin) {
    await db.insert(schema.users).values({ id: userId, name: "Admin", email: "admin@admin.com", password: hash, role: "admin" });
}
