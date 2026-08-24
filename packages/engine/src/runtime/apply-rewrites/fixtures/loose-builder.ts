import type { LooseNode } from './loose-node'

/**
 * The builder with its node types off: any tag, any shape, any number
 * of nodes as arguments.
 */
export type LooseBuilder = Record<string, (...args: unknown[]) => LooseNode>
