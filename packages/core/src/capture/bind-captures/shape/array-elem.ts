/**
 * The element type of an array shape; for a tuple, the union of its
 * positions.
 *
 * @typeParam S array or tuple shape
 */
export type ArrayElem<S extends readonly unknown[]> = S[number]
