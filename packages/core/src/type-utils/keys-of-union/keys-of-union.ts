/**
 * The union of property keys across every member of a union type `T`; used
 * to check name collisions across a union of shapes.
 *
 * @example type K = KeysOfUnion<{ a: 1 } | { b: 2 }> // "a" | "b"
 */
export type KeysOfUnion<T> = T extends unknown ? keyof T : never
