import type { ChainEntry } from '@ts-unify/core/internal'

import type { ChainPlan } from './chain-plan'
import { chains } from './chains'
import { EMPTY_CHAIN } from './empty-chain'

/**
 * What a chain does to a match, read once per chain; every empty chain
 * has the one empty plan.
 *
 * @param chain the chain
 */
export const chainPlanOf = (chain: ChainEntry[]): ChainPlan =>
  chain.length === 0 ? EMPTY_CHAIN : chains.of(chain)
