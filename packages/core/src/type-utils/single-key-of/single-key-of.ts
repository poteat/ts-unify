import type { UnionToIntersection } from '@/type-utils/union-to-intersection'

/**
 * SingleKeyOf<T>
 *
 * Yields the only key of an object type `T` when it has exactly one key;
 * otherwise yields `never`. Decided without walking the keys: a union of
 * two or more keys is not equal to its own intersection.
 *
 * Commonly used to enable single-capture ergonomics where special handling is
 * desired only for exactly-one-entry capture bags.
 */
export type SingleKeyOf<T> = [keyof T] extends [never]
  ? never
  : [keyof T] extends [UnionToIntersection<keyof T>]
    ? keyof T
    : never
