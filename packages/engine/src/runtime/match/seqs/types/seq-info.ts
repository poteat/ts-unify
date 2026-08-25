import type { ChainEntry } from '@ts-unify/core/internal'

/**
 * Where a `U.seq()` landed in an expanded array pattern, and its chain.
 */
export type SeqInfo = {
  /**
   * The index in the expanded array of the seq's first element.
   */
  start: number

  /**
   * How many elements the seq spans.
   */
  length: number

  /**
   * The seq proxy's chain, which may carry a `.to()`.
   */
  chain: ChainEntry[]
}
