import type { ChainEntry } from '@ts-unify/core/internal'

import Memo from './memo'
import type { ChainPlan } from './types'
import Util from './util'
/**
 * What a chain does to a match, read once per chain; every empty chain
 * has the one empty plan.
 *
 * @param chain the chain
 * @returns `EMPTY_CHAIN` for an empty chain, else the chain's memoized plan
 */
export const chainPlanOf = (chain: ChainEntry[]): ChainPlan =>
  chain.length === 0 ? Util.EMPTY_CHAIN : Memo.chains.of(chain)
