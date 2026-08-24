import type { UnionToIntersection } from '@/type-utils/union-to-intersection'

/**
 * The only key of an object type `T` when it has exactly one key, and
 * `never` otherwise.
 *
 * Decided without walking the keys: a union of two or more keys is not
 * equal to its own intersection. The single-capture overloads read it to
 * give a bag with exactly one entry its own handling.
 */
export type SingleKeyOf<T> = [keyof T] extends [never]
  ? never
  : [keyof T] extends [UnionToIntersection<keyof T>]
    ? keyof T
    : never
