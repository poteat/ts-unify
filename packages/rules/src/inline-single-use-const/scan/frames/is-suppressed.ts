import type { Suppressed } from './types'

/**
 * Whether a name is among the suppressed ones.
 *
 * @param suppressed the names, innermost first; none at the top
 * @param name the name
 */
export function isSuppressed(suppressed: Suppressed | null, name: string) {
  for (let at = suppressed; at !== null; at = at.up) {
    if (at.name === name) return true
  }

  return false
}
