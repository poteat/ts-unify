/**
 * What the parameter of `get` collapses to when the slot asked for is
 * filled by nothing the store holds, so the error names the slot.
 *
 * @typeParam S the slot's type
 */
export type Unfilled<S> = { readonly unfilled: S }
