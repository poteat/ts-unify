import type { UnionToTuple } from '@/type-utils/union-to-tuple'

/**
 * The keys of an object type as a tuple, for sequential processing of its
 * properties in the type system; the order may vary.
 *
 * @example type Result = KeysToTuple<{ a: 1; b: 2 }> // ["a", "b"]
 */
export type KeysToTuple<T> = T extends object ? UnionToTuple<keyof T> : []
