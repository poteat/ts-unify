import Plan from '../plan'
import FromPlan from './from-plan'
import type { RootLiteral } from './root-literal'

/**
 * Every literal a pattern requires under the node it matches, read from
 * its root plan; none for a bare `$`.
 *
 * @param pattern the pattern
 */
export const buildRootLiterals = (pattern: unknown): RootLiteral[] =>
  FromPlan.planLiterals(Plan.rootPlanOf(pattern), [])
