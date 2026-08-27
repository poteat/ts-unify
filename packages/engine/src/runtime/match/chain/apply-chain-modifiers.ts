import type { ChainEntry } from '@ts-unify/core/internal'
import Bags from '@ts-unify/engine/runtime/match/bags'
import type { Bag } from '@ts-unify/engine/runtime/types'

import Reads from './reads'
import type { MatchedNode } from './types'
/**
 * The bag after a chain's `.bind()` and `.seal()` entries.
 *
 * `.bind('name')` replaces the captures with the matched node under that
 * name; a bare `.bind()` names it after the key the node sits under, or
 * `node` at the root. `.seal()` re-keys a lone capture to that key.
 *
 * @param chain the proxy's chain
 * @param bag the captures of the proxy's own match
 * @param matched the node the proxy matched and the key it sits under
 * @returns the bound or sealed bag, or the bag as given when neither applies
 */
export function applyChainModifiers(
  chain: ChainEntry[],
  bag: Bag,
  matched: MatchedNode,
): Bag {
  const bindEntry = Reads.chainGet(chain, 'bind')

  if (bindEntry) {
    return {
      [(bindEntry.args[0] as string | undefined) ?? matched.key ?? 'node']:
        matched.node,
    }
  }

  const key = matched.key
  const isSealed = key !== undefined && Reads.chainHas(chain, 'seal')

  return isSealed ? Bags.sealed(bag, key) : bag
}
