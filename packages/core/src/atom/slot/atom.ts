import type { Keyed } from '@/atom/keyed'

/**
 * A slot: identity by reference, a phantom type, no value of its own. A
 * definition fills it; a store reads a value out of it.
 *
 * The phantom sits in both parameter and return position, so two slots of
 * different types are never one for the checker.
 *
 * @typeParam T the type a definition filling the slot reads out
 */
export type Atom<T> = Keyed & { readonly shape?: (value: T) => T }
