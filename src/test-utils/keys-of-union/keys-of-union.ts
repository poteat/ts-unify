/**
 * KeysOfUnion<T>
 *
 * Produces the union of property keys across a union type `T`.
 *
 * Useful in tests for checking name collisions against a union of AST node
 * shapes (e.g., `keyof NodeByKind[keyof NodeByKind]`).
 *
 * @example
 * type U = { a: 1 } | { b: 2 };
 * type K = KeysOfUnion<U>; // "a" | "b"
 */
export type KeysOfUnion<T> = T extends any ? keyof T : never;
