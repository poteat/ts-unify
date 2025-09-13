import type { UnionToTuple } from "../union-to-tuple";

/**
 * Converts object keys to a tuple for sequential processing.
 * Useful for iterating over object properties in type system.
 *
 * @example
 * type Result = KeysToTuple<{ a: 1; b: 2 }>;
 * //   ^? ["a", "b"] (order may vary)
 */
export type KeysToTuple<T> = T extends object ? UnionToTuple<keyof T> : [];
