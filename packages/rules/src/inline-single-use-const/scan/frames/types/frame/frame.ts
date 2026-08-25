import type { Node } from '@ts-unify/rules/inline-single-use-const/reads/tree'

/**
 * A node on the way down from a block's statement, with the frame of the
 * node above it; the statement's own frame has none above.
 */
export type Frame = { node: Node; up: Frame | null }
