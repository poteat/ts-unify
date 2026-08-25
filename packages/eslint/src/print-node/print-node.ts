import { prettyPrint, print } from 'recast'

import RecastShape from './recast-shape'
import Whitespace from './whitespace'

/**
 * Print an ESTree node (typescript-estree v8 shape) to source text via recast.
 *
 * The tree printed is a copy without source positions, so recast's
 * reprinting printer finds no original text at any node and prints as
 * its generic printer does, at the cost of the search; the generic
 * printer is used unless the text holds odd whitespace, which only the
 * reprinting printer keeps.
 *
 * @param node the node to print
 */
export function printNode(node: unknown) {
  const shaped = RecastShape.toRecastShape(node) as Parameters<typeof print>[0]

  return (
    Whitespace.hasOddWhitespace(shaped) ? print(shaped) : prettyPrint(shaped)
  ).code
}
