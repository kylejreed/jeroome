export const writeFile = async (path: string, file: File) => {
  return Bun.write(path, file);
};

export const getFile = async (name: string) => {
  return Bun.file(name);
};
