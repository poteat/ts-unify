import type { RewriteFactory } from '@engine/runtime/match/types'
/**
 * Where a `U.seq()` landed in an expanded array pattern, and the factory
 * of its `.to()`; undefined when the seq has none to record.
 */
export type SeqPlan = {
  start: number
  length: number
  factory: RewriteFactory | undefined
}
