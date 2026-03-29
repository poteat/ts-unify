/**
 * KeysOfUnion<T>
 *
 * Produces the union of property keys across a union type `T`.
 *
 * Useful for checking name collisions across unions of shapes.
 *
 * @example
 * type U = { a: 1 } | { b: 2 };
 * type K = KeysOfUnion<U>; // "a" | "b"
 */
export type KeysOfUnion<T> = T extends any ? keyof T : never;

