import type { RewriteSite } from '@engine/runtime/match/types'
import type { Bag, Path } from '@engine/runtime/types'

import type { NamedBinding } from './bindings'
/**
 * What one match accumulates as it walks the node, and the config defaults
 * it reads.
 */
export type MatchContext = {
  /**
   * Every inner `.to()` proxy that fired, in match order.
   */
  sites: RewriteSite[]

  /**
   * Where each named capture was read from.
   */
  capturePaths: Record<string, Path>

  /**
   * Every named capture's value, in match order.
   */
  namedBindings: readonly NamedBinding[]

  /**
   * The `.config({ key: value })` defaults config slots match against.
   */
  configDefaults: Bag

  /**
   * The root of the match when it is a `Program`; raw comments under it
   * get their node view. Undefined otherwise.
   */
  program: unknown

  /**
   * Records an inner `.to()` rewrite site.
   */
  recordSite: (site: RewriteSite) => void

  /**
   * Records the value a named capture bound.
   */
  bind: (name: string, value: unknown) => void
}
