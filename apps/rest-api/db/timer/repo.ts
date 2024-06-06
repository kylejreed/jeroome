import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

import { Repo } from "@leserver";
import { timer, type Timer, type TimerInsert, type TimerUpdate } from "./schema";
import { eq, and, isNull, desc } from "drizzle-orm";

export class TimerRepo extends Repo.SqliteRepo<Timer, TimerInsert, TimerUpdate, { id: number }> {
  constructor(db: BunSQLiteDatabase<any>) {
    super(db, timer);
  }

  async getRunningTimer(label: string) {
    const [existing] = await this.db
      .select()
      .from(timer)
      .where(and(eq(timer.label, label), isNull(timer.endedAt)));

    if (!existing) {
      return (
        await this.db
          .select()
          .from(timer)
          .where(and(eq(timer.label, label)))
          .orderBy(desc(timer.startedAt))
          .limit(1)
      )[0];
    }

    return existing;
  }

  async start(label: string) {
    const [{ id }] = await this.db.insert(timer).values({ label, startedAt: new Date() }).returning({ id: timer.id });
    return id;
  }

  async stop(id: number) {
    const [{ label, startedAt, endedAt }] = await this.db.update(timer).set({ endedAt: new Date() }).where(eq(timer.id, id)).returning();
    const duration = endedAt!.getTime() - startedAt.getTime();
    return { label, duration };
  }
}
