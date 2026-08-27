import type { Node } from '@ts-unify/rules/inline-single-use-const/reads/tree'

/**
 * A const a statement declares by a bare identifier: its name and its
 * initializer.
 */
export type Candidate = { name: string; init: Node }
