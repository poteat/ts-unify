import type { IsFilled } from '@/atom/is-filled'

/**
 * The members of a union of slots that a store type already fills.
 *
 * @typeParam C the store's type, as narrowed at the call
 * @typeParam S the slots to check, as a union
 */
export type Shadowed<C, S> = S extends unknown
  ? [IsFilled<C, S>] extends [true]
    ? S
    : never
  : never
