import Nodes from './nodes'

/**
 * A copy of a typescript-estree tree in the shape recast prints; the
 * input is left untouched.
 *
 * recast's TS printer predates typescript-estree v8: `recastNode` says
 * what the copy of each node carries beyond the original.
 *
 * @param value a node, a list of nodes, or a leaf value (a Literal's
 *   RegExp passes through whole)
 * @returns a leaf as is, a list mapped, a node copied through `recastNode`
 */
export function toRecastShape(value: unknown): unknown {
  const isLeaf =
    value === null || typeof value !== 'object' || value instanceof RegExp

  return isLeaf
    ? value
    : Array.isArray(value)
      ? value.map(toRecastShape)
      : Nodes.recastNode(value)
}
