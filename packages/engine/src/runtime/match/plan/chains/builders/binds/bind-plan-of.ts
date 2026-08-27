import type { ChainEntry } from '@ts-unify/core/internal'

import type { BindPlan } from './types'
/**
 * What a `.bind()` entry names: undefined for a bare `.bind()`.
 *
 * @param entry the chain's first `.bind()` entry
 * @returns the name given to `.bind()`, undefined when none was
 */
export const bindPlanOf = (entry: ChainEntry): BindPlan => ({
  name: entry.args[0] as string | undefined,
})
