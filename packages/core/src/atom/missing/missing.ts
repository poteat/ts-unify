import type { Filling } from '@/atom/filling'
import type { Fills } from '@/atom/fills'
import type { Reads } from '@/atom/reads'

/**
 * Every slot some definition in the tuple reads that no definition in it
 * fills; `never` when the tuple is complete.
 *
 * @typeParam R the definitions, as a tuple of their types
 */
export type Missing<R extends readonly Filling[]> = Exclude<
  Reads<R[number]>,
  Fills<R[number]>
>
