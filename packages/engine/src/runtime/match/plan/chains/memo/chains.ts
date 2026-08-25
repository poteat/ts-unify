import Builders from '@engine/runtime/match/plan/chains/builders'
import Memo from '@engine/runtime/match/plan/memo'
/**
 * The plans of chains, kept by the chain.
 */
export const chains = Memo.planMemo(Builders.buildChainPlan)
