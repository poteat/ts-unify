import type { Bag } from '../bag'
import type { Cursor } from '../context'
import Plan from '../plan'
import Planned from './planned'

/**
 * Matches one value against one pattern value of any kind, and returns
 * the captures, or null on mismatch.
 *
 * The pattern value is a capture, a config slot, a string predicate, a
 * proxy node, a fields record, or a literal compared by identity. A bare
 * `$` captures under the cursor's key, or under `_` without one.
 *
 * @param actual the value
 * @param expected the pattern value
 * @param at where the value sits in the match
 */
export const matchValueInner = (
  actual: unknown,
  expected: unknown,
  at: Cursor,
): Bag | null => Planned.matchPlan(actual, Plan.planOf(expected), at)
