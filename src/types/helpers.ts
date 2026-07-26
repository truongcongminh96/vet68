export type PickRequired<T, K extends keyof T> = Omit<Pick<T, K>, K> & Required<Pick<T, K>>;
