import { ZodObject, ZodType, z } from "zod";

export const createEnv = <T extends Record<string, ZodType>>(fn: (zod: typeof z) => T): z.infer<ZodObject<T>> => {
  const schema = z.object(fn(z));
  const out = schema.parse(process.env);

  return out;
};
