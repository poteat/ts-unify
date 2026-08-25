import type { RewriteFactory } from '@engine/runtime/match/types'
import type { Bag } from '@engine/runtime/types'
import type { ChainEntry } from '@ts-unify/core/internal'

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
