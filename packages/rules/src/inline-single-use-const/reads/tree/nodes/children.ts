import type { Node } from './types'

/**
 * The values under a node's child keys; the link back up, the location
 * and the range are left out.
 *
 * @param node the node
 * @returns the child values, in key order
 */
export const children = (node: Node) =>
  Object.entries(node)
    .filter(([k]) => k !== 'parent' && k !== 'loc' && k !== 'range')
    .map(([, v]) => v)
