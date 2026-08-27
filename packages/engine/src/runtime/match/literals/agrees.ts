import Reads from './reads'
import type { RootLiteral } from './types'
/**
 * Whether a node holds every root literal a pattern requires; a node that
 * does not fails the pattern's match.
 *
 * @param node the node
 * @param literals the pattern's root literals
 * @returns false at the first literal whose value the node does not hold, else
 *          true
 */
export function agrees(
  node: unknown,
  literals: readonly RootLiteral[],
): boolean {
  for (const literal of literals) {
    if (!Reads.admits(literal, Reads.valueAt(node, literal.path))) return false
  }

  return true
}
