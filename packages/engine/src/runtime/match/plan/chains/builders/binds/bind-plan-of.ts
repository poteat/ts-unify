import type { ChainEntry } from '@ts-unify/core/internal'

/**
 * What a `.bind()` entry names: undefined for a bare `.bind()`.
 *
 * @param entry the chain's first `.bind()` entry
 */
export const bindPlanOf = (
  entry: ChainEntry,
): { name: string | undefined } => ({
  name: entry.args[0] as string | undefined,
})
