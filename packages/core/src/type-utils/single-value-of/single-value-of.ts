import type { SingleKeyOf } from "@/type-utils/single-key-of";

/**
 * SingleValueOf<T>
 *
 * Returns the value type for the only property of an object type `T` when it
 * has exactly one key; otherwise yields `never`.
 *
 * Commonly used to enable single-capture ergonomics, e.g., overloads that
 * accept `(value) => …` when there is exactly one capture in a bag.
 */
export type SingleValueOf<T> = T extends object
  ? SingleKeyOf<T> extends infer K
    ? T[K & keyof T]
    : never
  : never;
