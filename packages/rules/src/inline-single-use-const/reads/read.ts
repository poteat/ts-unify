import type { Node } from './tree'

/**
 * One read of a name: the identifier, and the chain of nodes above it
 * within the tree searched, innermost last.
 */
export type Read = { node: Node; above: Node[] }
