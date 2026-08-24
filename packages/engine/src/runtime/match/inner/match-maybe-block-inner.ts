import type { Bag } from '../bag'
import type { Cursor } from '../context'
import { matchValueInner } from './match-value-inner'

/**
 * Matches a statement pattern against a value that may be the statement
 * itself or a block holding only it, the block tried first.
 *
 * @param actual the value
 * @param stmtPattern the statement pattern
 * @param at where the value sits in the match
 */
export function matchMaybeBlockInner(
  actual: unknown,
  stmtPattern: unknown,
  at: Cursor,
): Bag | null {
  const actualRec = actual as Record<string, unknown> | null | undefined

  if (
    actualRec?.type === 'BlockStatement' &&
    Array.isArray(actualRec.body) &&
    actualRec.body.length === 1
  ) {
    const result = matchValueInner(
      (actualRec.body as unknown[])[0],
      stmtPattern,
      {
        ctx: at.ctx,
        path: [...at.path, 'body', 0],
      },
    )
    if (result) return result
  }

  return matchValueInner(actual, stmtPattern, at)
}
