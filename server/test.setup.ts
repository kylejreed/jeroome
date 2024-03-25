import { beforeAll } from 'bun:test';
import { migrate } from 'drizzle-orm/libsql/migrator';

import db, { schema } from '@db';
import type { User } from '@db/schema/auth';
import { create_users } from './drizzle/seed';
export let testUsers: User[];

const opts = {
    numUsers: 10
};

beforeAll(async () => {
    await migrate(db, { migrationsFolder: "./drizzle" });
    await seed_db();
});

async function seed_db() {
    await db.delete(schema.users); // empty the table
    testUsers = await create_users(opts.numUsers);
}
