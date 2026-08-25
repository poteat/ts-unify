import Context from '@engine/runtime/match/context'
import Plan from '@engine/runtime/match/plan'
import type { Bag } from '@engine/runtime/types'
import { $ } from '@ts-unify/core/internal'

import Planned from './planned'
/**
 * Matches a node against a fields record, one property at a time, and
 * returns the captures, or null on mismatch.
 *
 * A bare `$` as the whole pattern captures every structural property of
 * the node; a pattern built with `{ ...$ }` captures the properties it did
 * not name.
 *
 * @param node the node
 * @param pattern the fields record, or `$`
 * @param at where the node sits in the match
 */
export const matchInner = (
  node: unknown,
  pattern: unknown,
  at: Context.Cursor,
): Bag | null =>
  pattern === $
    ? Context.captureRest(node, at, Context.NO_KEYS)
    : Planned.matchFields(node, Plan.fieldsPlanOf(pattern), at)
