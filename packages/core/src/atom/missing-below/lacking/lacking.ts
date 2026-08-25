import type { IsFilled } from '@/atom/is-filled'

/**
 * The members of a union of slots that a store type does not fill.
 *
 * @typeParam C the store's type, as narrowed at the call
 * @typeParam S the slots to check, as a union
 */
export type Lacking<C, S> = S extends unknown
  ? [IsFilled<C, S>] extends [true]
    ? never
    : S
  : never
