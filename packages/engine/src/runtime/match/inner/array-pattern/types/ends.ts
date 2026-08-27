/**
 * The pattern elements before the first spread and after the last, matched
 * at an array's head and tail.
 */
export type Ends<E> = { before: readonly E[]; after: readonly E[] }
