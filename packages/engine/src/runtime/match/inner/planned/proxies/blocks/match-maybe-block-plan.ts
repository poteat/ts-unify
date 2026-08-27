import type { Cursor } from '@ts-unify/engine/runtime/match/context'
import { matchPlan } from '@ts-unify/engine/runtime/match/inner/planned/match-plan'
import type { Plan } from '@ts-unify/engine/runtime/match/plan'
import type { Bag } from '@ts-unify/engine/runtime/types'
/**
 * Matches the plan of a statement pattern against a value that may be
 * the statement itself or a block holding only it, the block tried first.
 *
 * @param actual the value
 * @param statement the statement pattern's plan
 * @param at where the value sits in the match
 * @returns the captures of the block's one statement when it matches, else
 *          those of the whole, or null
 */
export function matchMaybeBlockPlan(
  actual: unknown,
  statement: Plan,
  at: Cursor,
): Bag | null {
  const actualRec = actual as Record<string, unknown> | null | undefined

  const isSingleStatementBlock =
    actualRec?.type === 'BlockStatement' &&
    Array.isArray(actualRec.body) &&
    actualRec.body.length === 1

  if (isSingleStatementBlock) {
    const result = matchPlan((actualRec.body as unknown[])[0], statement, {
      ctx: at.ctx,
      path: [...at.path, 'body', 0],
    })
    if (result) return result
  }

  return matchPlan(actual, statement, at)
}
