import type { ChainEntry } from '@ts-unify/core/internal'

import type { Bag } from '../bag'
import { chainGet } from './chain-get'
import { chainHas } from './chain-has'

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
 */
export function applyChainModifiers(
  chain: ChainEntry[],
  bag: Bag,
  matched: { node: unknown; key?: string },
): Bag {
  const bindEntry = chainGet(chain, 'bind')

  if (bindEntry) {
    return {
      [(bindEntry.args[0] as string | undefined) ?? matched.key ?? 'node']:
        matched.node,
    }
  }

  if (chainHas(chain, 'seal') && matched.key) {
    const keys = Object.keys(bag)

    return keys.length === 1
      ? { [matched.key]: bag[keys[0]] }
      : keys.length === 0
        ? {}
        : bag
  }

  return bag
}
