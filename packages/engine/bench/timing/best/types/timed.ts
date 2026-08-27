/**
 * The milliseconds a run of a function took, with what it returned.
 */
export type Timed<T> = { ms: number; result: T }
