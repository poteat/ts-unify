import type { Keyed } from '@/atom/keyed'

/**
 * A fresh slot: a symbol nothing else holds, with the label as its
 * description for error text.
 *
 * @param label the name error text calls the slot by
 */
export const slotOf = (label?: string): Keyed => ({ key: Symbol(label) })
