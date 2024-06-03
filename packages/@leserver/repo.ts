import { and, eq } from "drizzle-orm";
import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";

export class SqliteRepo<TSelect, TInsert, TUpdate, TUnique> {
  constructor(
    public db: BunSQLiteDatabase<any>,
    public schema: any,
  ) {}

  async findMany() {
    return this.db.select().from(this.schema).all();
  }

  findOne(where: TUnique): TSelect {
    return this.db
      .select()
      .from(this.schema)
      .where(and(...this.toWhere(where))) as TSelect;
  }

  exists(where: TUnique) {
    return !!this.findOne(where);
  }

  create(data: TInsert): void;
  create(data: TInsert, returning?: boolean): TSelect;
  create(data: TInsert, returning?: boolean): void | TSelect {
    const query = this.db.insert(this.schema).values(data as any);
    if (returning) {
      return query.returning() as TSelect;
    }

    query.execute();
  }

  update(where: TUnique, data: TUpdate): void;
  update(where: TUnique, data: TUpdate, returning?: boolean): TSelect;
  update(where: TUnique, data: TUpdate, returning?: boolean): void | TSelect {
    const query = this.db
      .update(this.schema)
      .set(data as any)
      .where(and(...this.toWhere(where)));

    if (returning) {
      return query.returning() as TSelect;
    }

    query.execute();
  }

  delete(where: TUnique) {
    this.db.delete(this.schema).where(and(...this.toWhere(where)));
  }

  protected toWhere(where: Partial<TUnique>) {
    return Object.entries(where).map(([k, v]) => eq(this.schema[k], v));
  }
}
