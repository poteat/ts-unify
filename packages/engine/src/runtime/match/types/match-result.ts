import type { Bag, Path } from '@engine/runtime/types'

import type { RewriteSite } from './sites'
/**
 * A successful match with its rewrite metadata.
 */
export type MatchResult = {
  /**
   * The merged capture bag.
   */
  bag: Bag

  /**
   * Every `.to()` proxy that fired during the match, a root-level `.to()`
   * from the chain included.
   */
  sites: RewriteSite[]

  /**
   * Where each named capture was read from, so deeper rewrites can rebind
   * the captures visible outside them.
   */
  capturePaths: Record<string, Path>
}
