import type { Node } from '@ts-unify/rules/inline-single-use-const/reads/tree'

/**
 * A single-declarator const at its place in a block: the statement's
 * index, the const's name and its initializer.
 */
export type CandidateAt = { index: number; name: string; init: Node }
