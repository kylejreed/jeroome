import type { BunFile } from "bun";
import { unlink } from "node:fs/promises";
import { join } from "path";

export type Uploader<T = File> = {
  write: (name: string, file: File) => Promise<any>;
  get: (name: string) => T | Promise<T>;
  remove: (name: string) => Promise<any>;
};

export const localFileUpload = (opts: { dir: string }): Uploader<BunFile> => {
  return {
    write: (name: string, file: File) => Bun.write(join(process.cwd(), opts.dir, name), file),
    get: (name: string) => Bun.file(join(process.cwd(), opts.dir, name)),
    remove: (name: string) => unlink(join(process.cwd(), opts.dir, name)),
  };
};
