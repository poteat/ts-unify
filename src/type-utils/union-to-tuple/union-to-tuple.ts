import type { LastOf } from "@/type-utils/last-of";

/**
 * Converts a union type to a tuple type.
 * Uses tail-call optimization pattern for recursion.
 *
 * @example
 * type Result = UnionToTuple<1 | 2 | 3>;
 * //   ^? [1, 2, 3] (order may vary)
 */
export type UnionToTuple<T, Acc extends readonly any[] = []> = 0 extends 1
  ? never
  : [T] extends [never]
  ? Acc
  : LastOf<T> extends infer Last
  ? UnionToTuple<Exclude<T, Last>, [...Acc, Last]>
  : never;
