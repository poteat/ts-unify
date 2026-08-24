import type { Bag } from './bag'

/**
 * A rule's `.to()` callback: builds the output node from a match's bag.
 */
export type Factory = (bag: Bag) => unknown
