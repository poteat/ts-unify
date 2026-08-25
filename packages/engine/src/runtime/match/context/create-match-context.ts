import Plan from '@engine/runtime/match/plan'
import type { ChainEntry } from '@ts-unify/core/internal'

import FromPlan from './from-plan'
import type { MatchContext } from './types'
/**
 * A fresh context for one match, holding its own sites and bindings.
 *
 * @param chain the root chain, whose `.config()` entry supplies the defaults
 * @param program the root node when it is a `Program`
 */
export const createMatchContext = (
  chain: ChainEntry[] = [],
  program: unknown = undefined,
): MatchContext => FromPlan.matchContextOf(Plan.chainPlanOf(chain), program)
