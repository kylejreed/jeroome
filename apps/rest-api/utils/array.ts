export const zip = <T, K>(arr1: T[], arr2: K[]): [T, K][] => {
  return arr1.map((item, i) => [item, arr2[i]]);
};
