/**
 * The elements of an array pattern matched in order from an array index
 * on, and that index.
 */
export type Run<E> = { elements: readonly E[]; start: number }
