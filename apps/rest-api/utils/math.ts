export const avg = (arr: number[]) => {
  if (arr.length === 0) return 0;
  return arr.reduce((acc, c) => acc + c, 0) / arr.length;
};
