import { META_KEYS } from './meta-keys'

/**
 * Structural equality of two values, arrays by element and objects by
 * key, with the meta keys left out.
 *
 * @param a one value
 * @param b the other
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (a == null || b == null) return false
  if (typeof a !== typeof b) return false
  if (typeof a !== 'object') return false
  if (Array.isArray(a) !== Array.isArray(b)) return false

  if (Array.isArray(a)) {
    return (
      a.length === (b as unknown[]).length &&
      a.every((v: unknown, i: number) => deepEqual(v, (b as unknown[])[i]))
    )
  }

  const aRec = a as Record<string, unknown>
  const bRec = b as Record<string, unknown>
  const keysA = Object.keys(aRec).filter(k => !META_KEYS.has(k))

  return (
    keysA.length === Object.keys(bRec).filter(k => !META_KEYS.has(k)).length &&
    keysA.every(k => deepEqual(aRec[k], bRec[k]))
  )
}
