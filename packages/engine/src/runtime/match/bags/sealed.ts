import type { Bag } from '@ts-unify/engine/runtime/types'
/**
 * The bag after `.seal()` under a key: a lone capture re-keyed to that
 * key; no capture, or several, left as they are.
 *
 * @param bag the captures of the proxy's own match
 * @param key the key the node sits under
 * @returns a bag with the lone capture under the key, or the captures as they
 *          were
 */
export function sealed(bag: Bag, key: string): Bag {
  const keys = Object.keys(bag)
  const hasLoneCapture = keys.length === 1
  const isEmpty = keys.length === 0

  return hasLoneCapture ? { [key]: bag[keys[0]] } : isEmpty ? {} : bag
}
