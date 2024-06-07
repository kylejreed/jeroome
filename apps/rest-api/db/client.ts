import { Database } from "leserver";

import { env } from "../config";
import { schema } from "./schema";

export const client = await Database.sqlite(env.DATABASE_URL, schema);
