import type { Capture } from '@/capture/capture-type'

/**
 * A tuple of captures named by index, one per position of a tuple shape,
 * each typed as that position.
 *
 * @typeParam S tuple shape
 * @typeParam Acc captures built so far
 */
export type TupleCaptures<
  S extends readonly unknown[],
  Acc extends readonly unknown[] = [],
> = S extends readonly [infer H, ...infer R]
  ? TupleCaptures<
      R extends readonly unknown[] ? R : never,
      [...Acc, Capture<`${Acc['length'] & number}`, H>]
    >
  : Acc
