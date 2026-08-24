import type { ChainEntry } from '@ts-unify/core/internal'

import type { Bag } from '../bag'
import { chainGet } from './chain-get'

/**
 * The defaults a chain's `.config({ key: value })` entry carries for the
 * config slots of the pattern and the output; empty without one.
 *
 * @param chain the chain
 */
export function extractConfigDefaults(chain: ChainEntry[]): Bag {
  const configEntry = chainGet(chain, 'config')

  return (configEntry?.args[0] ?? {}) as Bag
}
