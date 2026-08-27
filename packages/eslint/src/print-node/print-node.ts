import { prettyPrint, print } from 'recast'

import RecastShape from './recast-shape'
import Whitespace from './whitespace'

/**
 * Print an ESTree node (typescript-estree v8 shape) to source text via recast.
 *
 * The tree printed is a copy without source positions, so the reprinting
 * printer finds no original text and prints generically at the cost of
 * the search; it is used only for odd whitespace, which it alone keeps.
 *
 * @param node the node to print
 * @returns the node's source text as recast prints it
 */
export function printNode(node: unknown) {
  const shaped = RecastShape.toRecastShape(node) as Parameters<typeof print>[0]

  return (
    Whitespace.hasOddWhitespace(shaped) ? print(shaped) : prettyPrint(shaped)
  ).code
}
