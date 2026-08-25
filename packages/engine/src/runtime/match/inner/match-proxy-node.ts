import type { Cursor } from '@ts-unify/engine/runtime/match/context'
import Plan from '@ts-unify/engine/runtime/match/plan'
import type { Bag } from '@ts-unify/engine/runtime/types'

import Planned from './planned'
/**
 * Matches a value against a proxy node pattern, such as
 * `U.Identifier({ ... })`, `U.or(...)` or `U.maybeBlock(...)`.
 *
 * An or tries its alternatives, a maybeBlock looks through a
 * one-statement block, and any other tag must be the value's type. The
 * chain's guards, seal, bind and `.to()` then apply to the captures.
 *
 * @param actual the value
 * @param expected the proxy node
 * @param at where the value sits in the match
 */
export const matchProxyNode = (
  actual: unknown,
  expected: unknown,
  at: Cursor,
): Bag | null => Planned.matchProxyPlan(actual, Plan.proxyPlanOf(expected), at)
