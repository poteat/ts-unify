import type { ChainEntry } from '@ts-unify/core/internal'

import type { Bag } from '../bag'
import type { RewriteFactory } from '../rewrite-factory'
import { chainGet } from './chain-get'

/**
 * The factory a chain's `.to()` carries; a bare `.to()` yields the bag's
 * first value. Undefined when the chain has no `.to()`.
 *
 * @param chain the chain
 */
export function toFactory(chain: ChainEntry[]): RewriteFactory | undefined {
  const toEntry = chainGet(chain, 'to')

  return (
    toEntry &&
    ((toEntry.args[0] as RewriteFactory | undefined) ??
      ((bag: Bag) => Object.values(bag)[0]))
  )
}
