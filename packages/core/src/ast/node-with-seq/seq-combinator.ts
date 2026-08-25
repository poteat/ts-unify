import type { SeqResult } from './types'

/**
 * `U.seq(...)`: sequential composition for array patterns. Matches a
 * contiguous run of elements and merges their captures.
 *
 * Chain `.to(factory)` for an inline rewrite of the matched elements.
 */
export type SeqCombinator = {
  <Elements extends unknown[]>(...elements: Elements): SeqResult<Elements>
}
