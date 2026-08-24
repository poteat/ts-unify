import { planMemo } from '../plan-memo'
import { buildChainPlan } from './build-chain-plan'

/**
 * The plans of chains, kept by the chain.
 */
export const chains = planMemo(buildChainPlan)
