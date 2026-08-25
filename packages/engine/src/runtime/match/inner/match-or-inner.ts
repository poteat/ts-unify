import type { Cursor } from '@engine/runtime/match/context'
import Plan from '@engine/runtime/match/plan'
import type { Bag } from '@engine/runtime/types'

import Planned from './planned'
/**
 * Matches a value against the alternatives of a `U.or(...)`, in order,
 * and returns the first one's captures; null when none matches.
 *
 * @param actual the value
 * @param args the alternatives
 * @param at where the value sits in the match
 */
export const matchOrInner = (
  actual: unknown,
  args: unknown[],
  at: Cursor,
): Bag | null => Planned.matchOrPlans(actual, args.map(Plan.planOf), at)
