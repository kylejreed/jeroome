
export function times(n: number, iteratee: (index: number) => any) {
    let index = -1;
    const result = new Array(n);
    while (++index < n) {
        result[index] = iteratee(index);
    }
    return result;
}
