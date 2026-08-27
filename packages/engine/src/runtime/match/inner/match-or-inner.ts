import type { Cursor } from '@ts-unify/engine/runtime/match/context'
import Plan from '@ts-unify/engine/runtime/match/plan'
import type { Bag } from '@ts-unify/engine/runtime/types'

import Planned from './planned'
/**
 * Matches a value against the alternatives of a `U.or(...)`, in order,
 * and returns the first one's captures; null when none matches.
 *
 * @param actual the value
 * @param args the alternatives
 * @param at where the value sits in the match
 * @returns the first matching alternative's captures, or null when none matches
 */
export const matchOrInner = (
  actual: unknown,
  args: unknown[],
  at: Cursor,
): Bag | null => Planned.matchOrPlans(actual, args.map(Plan.planOf), at)
