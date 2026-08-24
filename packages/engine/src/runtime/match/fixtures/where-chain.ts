import type { ChainEntry } from '@ts-unify/core/internal'

/**
 * A chain of one `.where()` entry over the constraints.
 *
 * @param constraints the constraint proxies, each with a quantifier
 */
export const whereChain = (...constraints: unknown[]): ChainEntry[] => [
  { method: 'where', args: constraints },
]
