import { print } from 'recast'

import RecastShape from './recast-shape'

/**
 * Print an ESTree node (typescript-estree v8 shape) to source text via recast.
 *
 * @param node the node to print
 */
export const printNode = (node: unknown) =>
  print(RecastShape.toRecastShape(node) as Parameters<typeof print>[0]).code
