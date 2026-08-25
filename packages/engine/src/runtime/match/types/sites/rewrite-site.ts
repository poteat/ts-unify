import type { Bag, Path } from '@engine/runtime/types'

import type { RewriteFactory } from './factories'
/**
 * One inner `.to()` rewrite, applied bottom-up after the match.
 */
export type RewriteSite = {
  /**
   * Where within the matched node the inner pattern lived.
   */
  path: Path

  /**
   * Builds the replacement from the bag.
   */
  factory: RewriteFactory

  /**
   * The bag the factory reads: the root bag once the match is final.
   *
   * So a factory sees every capture, and the rebinding applyRewrites does
   * in place as deeper sites land.
   */
  scopeBag: Bag

  /**
   * How many array elements a seq site consumed.
   */
  span?: number
}
