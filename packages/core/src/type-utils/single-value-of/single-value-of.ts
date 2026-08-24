import type { SingleKeyOf } from '@/type-utils/single-key-of'

/**
 * The value type of the only property of an object type `T` when it has
 * exactly one key, and `never` otherwise.
 *
 * The overloads that accept `(value) => …` for a bag with exactly one
 * capture read it.
 */
export type SingleValueOf<T> = T extends object
  ? SingleKeyOf<T> extends infer K
    ? T[K & keyof T]
    : never
  : never
