import type { LastOf } from '@/type-utils/last-of'

/**
 * A union type turned into a tuple, built by tail recursion on the last
 * member; the order may vary.
 *
 * @example type Result = UnionToTuple<1 | 2 | 3> // [1, 2, 3]
 */
export type UnionToTuple<T, Acc extends readonly unknown[] = []> = 0 extends 1
  ? never
  : [T] extends [never]
    ? Acc
    : LastOf<T> extends infer Last
      ? UnionToTuple<Exclude<T, Last>, [...Acc, Last]>
      : never
