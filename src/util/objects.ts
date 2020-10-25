export type Indexed<T> = { [k: string]: T };

export function index<T>(fn: (t: T) => string, xs: T[]): Indexed<T> {
    return xs.reduce((acc, t) => {
        acc[fn(t)] = t;
        return acc
    }, {} as Indexed<T>);
}
