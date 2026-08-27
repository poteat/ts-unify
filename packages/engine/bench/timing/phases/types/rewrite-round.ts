/**
 * One round of the rewrite phase over a rule's matches: how many printed,
 * and the milliseconds the rewrites and their prints took.
 */
export type RewriteRound = { printed: number; ms: number }
