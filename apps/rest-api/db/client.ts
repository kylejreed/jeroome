import { Database } from "../lib";
import { schema } from "./schema";

export const client = await Database.sqlite("data.db", schema);
