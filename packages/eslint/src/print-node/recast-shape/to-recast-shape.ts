import { recastNode } from './recast-node'

/**
 * A copy of a typescript-estree tree in the shape recast prints; the
 * input is left untouched.
 *
 * recast's TS printer predates typescript-estree v8: `recastNode` says
 * what the copy of each node carries beyond the original.
 *
 * @param value a node, a list of nodes, or a leaf value (a Literal's
 *   RegExp passes through whole)
 */
export const toRecastShape = (value: unknown): unknown =>
  value === null || typeof value !== 'object' || value instanceof RegExp
    ? value
    : Array.isArray(value)
      ? value.map(toRecastShape)
      : recastNode(value)
