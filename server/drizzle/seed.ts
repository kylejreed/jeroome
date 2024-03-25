import db, { schema } from "@db";
import { randEmail, randFullName, randUserName } from '@ngneat/falso';
import { times } from '@lib/utils';
import type { User } from "@db/schema/auth";

const create_password = (val: string) => Bun.password.hash(val);

export async function create_users(numUsers = 10) {
    const insertValues: User[] = await Promise.all(times(numUsers, async i => ({
        id: i.toString(),
        name: randFullName(),
        email: randEmail(),
        username: randUserName(),
        password: await create_password(i.toString()),
        role: "user"
    })));

    return await db
        .insert(schema.users)
        .values(insertValues)
        .returning();
}

if (import.meta.main) {
    await db.delete(schema.users); // empty the table
    await create_users(10);
}
