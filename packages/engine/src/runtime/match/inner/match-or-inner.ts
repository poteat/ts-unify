import type { Bag } from '../bag'
import type { Cursor } from '../context'
import { matchValueInner } from './match-value-inner'

/**
 * Matches a value against the alternatives of a `U.or(...)`, in order,
 * and returns the first one's captures; null when none matches.
 *
 * @param actual the value
 * @param args the alternatives
 * @param at where the value sits in the match
 */
export function matchOrInner(
  actual: unknown,
  args: unknown[],
  at: Cursor,
): Bag | null {
  for (const arg of args) {
    const result = matchValueInner(actual, arg, at)
    if (result) return result
  }

  return null
}
