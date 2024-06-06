import * as fs from "./fs";
export type FSService = typeof fs;

import * as uploads from "./uploads";
export type { Uploader } from "./uploads";

export { fs, uploads };
