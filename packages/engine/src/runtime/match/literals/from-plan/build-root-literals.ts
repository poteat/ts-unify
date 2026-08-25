import type { RootLiteral } from '@ts-unify/engine/runtime/match/literals/types'
import Plan from '@ts-unify/engine/runtime/match/plan'

import Plans from './plans'
/**
 * Every literal a pattern requires under the node it matches, read from
 * its root plan; none for a bare `$`.
 *
 * @param pattern the pattern
 */
export const buildRootLiterals = (pattern: unknown): RootLiteral[] =>
  Plans.planLiterals(Plan.rootPlanOf(pattern), [])
