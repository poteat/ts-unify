import FromPlan from '@ts-unify/engine/runtime/match/literals/from-plan'
import Plan from '@ts-unify/engine/runtime/match/plan'
/**
 * What each pattern object requires under a node, kept by the pattern.
 */
export const rootLiterals = Plan.planMemo(FromPlan.buildRootLiterals)
