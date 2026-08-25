import type { ChainEntry } from '@ts-unify/core/internal'

import type { ChainMethod } from './types'
/**
 * The first entry of the method in a chain, if any.
 *
 * @param chain the chain
 * @param method the method
 */
export const chainGet = (
  chain: ChainEntry[],
  method: ChainMethod,
): ChainEntry | undefined => chain.find(e => e.method === method)
