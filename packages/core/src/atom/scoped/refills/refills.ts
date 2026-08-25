/**
 * What a parameter of `scope` collapses to when a definition fills a slot
 * the parent store fills already, so the error names the slot.
 *
 * @typeParam M the slots filled twice, as a union
 */
export type Refills<M> = { readonly refills: M }
