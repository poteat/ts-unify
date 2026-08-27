import type { Cursor } from '@ts-unify/engine/runtime/match/context'
import Plan from '@ts-unify/engine/runtime/match/plan'
import type { Bag } from '@ts-unify/engine/runtime/types'

import Planned from './planned'
/**
 * Matches a statement pattern against a value that may be the statement
 * itself or a block holding only it, the block tried first.
 *
 * @param actual the value
 * @param stmtPattern the statement pattern
 * @param at where the value sits in the match
 * @returns the captures of whichever form matched, or null when neither does
 */
export const matchMaybeBlockInner = (
  actual: unknown,
  stmtPattern: unknown,
  at: Cursor,
): Bag | null =>
  Planned.matchMaybeBlockPlan(actual, Plan.planOf(stmtPattern), at)
