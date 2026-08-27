import type { Node } from '@ts-unify/rules/inline-single-use-const/reads/tree'

/**
 * A const a block can inline: its index among the statements, its name,
 * its initializer and the one read the initializer replaces.
 */
export type Inlinable = { index: number; name: string; init: Node; read: Node }
