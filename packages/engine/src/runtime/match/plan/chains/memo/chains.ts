import Builders from '@ts-unify/engine/runtime/match/plan/chains/builders'
import Memo from '@ts-unify/engine/runtime/match/plan/memo'
/**
 * The plans of chains, kept by the chain.
 */
export const chains = Memo.planMemo(Builders.buildChainPlan)
