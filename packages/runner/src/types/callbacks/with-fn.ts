import type { Bag } from './bag'

/**
 * A rule's `.with()` callback: derives fields to add to a match's bag.
 */
export type WithFn = (bag: Bag) => Bag
