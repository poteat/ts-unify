import type { Held } from '@/atom/held'

/**
 * The definitions a store type holds that fill a slot.
 *
 * @typeParam C the store's type, as narrowed at the call
 * @typeParam S the slot's type
 */
export type Defining<C, S> = Extract<Held<C>, { readonly slot: S }>
