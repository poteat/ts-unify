import type { ChainEntry } from '@ts-unify/core/internal'

/**
 * One entry pattern of a rule: the node tag it matches, the pattern
 * shape under that tag, and the chain of methods called on it.
 */
export type PatternEntry = {
  tag: string
  pattern: Record<string, unknown>
  chain: ChainEntry[]
}
