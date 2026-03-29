import type { KeysToTuple } from "@/type-utils/keys-to-tuple";

/**
 * SingleKeyOf<T>
 *
 * Yields the only key of an object type `T` when it has exactly one key;
 * otherwise yields `never`.
 *
 * Commonly used to enable single-capture ergonomics where special handling is
 * desired only for exactly-one-entry capture bags.
 */
export type SingleKeyOf<T> = KeysToTuple<T> extends readonly [infer K]
  ? K & keyof T
  : never;
