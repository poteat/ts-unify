import type { ChainEntry } from '@ts-unify/core/internal'

import type { ChainMethod } from './types'
/**
 * Whether a chain carries an entry of the method.
 *
 * @param chain the chain
 * @param method the method
 * @returns true when some entry's method matches
 */
export const chainHas = (chain: ChainEntry[], method: ChainMethod) =>
  chain.some(e => e.method === method)
