import type { ChainEntry } from '@ts-unify/core/internal'
import type { RewriteFactory } from '@ts-unify/engine/runtime/match/types'
import type { Bag } from '@ts-unify/engine/runtime/types'

import Reads from './reads'
/**
 * The factory a chain's `.to()` carries; a bare `.to()` yields the bag's
 * first value. Undefined when the chain has no `.to()`.
 *
 * @param chain the chain
 */
export function toFactory(chain: ChainEntry[]): RewriteFactory | undefined {
  const toEntry = Reads.chainGet(chain, 'to')

  return (
    toEntry &&
    ((toEntry.args[0] as RewriteFactory | undefined) ??
      ((bag: Bag) => Object.values(bag)[0]))
  )
}
