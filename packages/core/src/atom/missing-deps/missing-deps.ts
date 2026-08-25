/**
 * What a parameter collapses to in place of a definition when a slot it
 * reads is filled by nothing, so the error names the slot.
 *
 * @typeParam M the missing slots, as a union
 */
export type MissingDeps<M> = { readonly missing: M }
