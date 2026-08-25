import type { ChainEntry } from '@ts-unify/core/internal'
import type { Bag } from '@ts-unify/engine/runtime/types'
/**
 * Whether every `.when()` guard in a chain accepts the bag; true without
 * any.
 *
 * @param chain the chain
 * @param bag the captures so far
 */
export function applyWhenGuards(chain: ChainEntry[], bag: Bag) {
  for (const entry of chain) {
    if (entry.method === 'when') {
      const guardFn = entry.args[0]
      if (typeof guardFn === 'function' && !guardFn(bag)) return false
    }
  }

  return true
}
