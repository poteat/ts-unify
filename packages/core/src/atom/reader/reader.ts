/**
 * A definition's read function as a store holds it, its parameter `never`.
 *
 * The store builds the deps object by name at runtime, so the checker
 * cannot type it; one door in the store hands the built object over.
 */
export type Reader = (deps: never) => unknown
