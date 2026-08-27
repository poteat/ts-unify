import Keys from './keys'
/**
 * Whether two values are structurally equal: same primitives, or arrays
 * and objects equal member by member, with `POSITION_KEYS` left out.
 *
 * @param a one value
 * @param b the other
 * @returns true when both are the same primitive or equal member by member
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true

  if (a == null || b == null) return false

  if (typeof a !== typeof b) return false

  if (typeof a !== 'object') return false

  if (Array.isArray(a) !== Array.isArray(b)) return false

  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length &&
      a.every((v, i) => deepEqual(v, (b as unknown[])[i]))
    )
  }

  const aRec = a as Record<string, unknown>
  const bRec = b as Record<string, unknown>
  const aKeys = Keys.structuralKeys(aRec)

  return (
    aKeys.length === Keys.structuralKeys(bRec).length &&
    aKeys.every(k => deepEqual(aRec[k], bRec[k]))
  )
}
