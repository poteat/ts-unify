import type { Bag } from './bag'

/**
 * What a `.to()` carries: builds the replacement node from the captures.
 *
 * @param bag every capture of the whole match
 */
export type RewriteFactory = (bag: Bag) => unknown
