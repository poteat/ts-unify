import type { Bag } from '@ts-unify/engine/runtime/types'
/**
 * The bag after `.seal()` under a key: a lone capture re-keyed to that
 * key; no capture, or several, left as they are.
 *
 * @param bag the captures of the proxy's own match
 * @param key the key the node sits under
 */
export function sealed(bag: Bag, key: string): Bag {
  const keys = Object.keys(bag)

  return keys.length === 1
    ? { [key]: bag[keys[0]] }
    : keys.length === 0
      ? {}
      : bag
}
