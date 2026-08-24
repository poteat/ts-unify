import type { ChainEntry } from '@ts-unify/core/internal'

/**
 * One entry pattern of a rule with the chain its guards come from; a
 * root `U.or` yields one per branch.
 */
export type Candidate = {
  tag: string
  pattern: Record<string, unknown>
  chain: ChainEntry[]
}
