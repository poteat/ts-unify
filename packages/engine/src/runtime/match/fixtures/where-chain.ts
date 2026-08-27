import type { ChainEntry } from '@ts-unify/core/internal'

/**
 * A chain of one `.where()` entry over the constraints.
 *
 * @param constraints the constraint proxies, each with a quantifier
 * @returns a one-entry chain, the `.where()` entry's args being the constraints
 */
export const whereChain = (...constraints: unknown[]): ChainEntry[] => [
  { method: 'where', args: constraints },
]
