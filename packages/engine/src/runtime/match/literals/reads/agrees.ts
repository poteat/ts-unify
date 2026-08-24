import type { RootLiteral } from '../root-literal'
import { admits } from './admits'
import { valueAt } from './value-at'

/**
 * Whether a node holds every root literal a pattern requires; a node that
 * does not fails the pattern's match.
 *
 * @param node the node
 * @param literals the pattern's root literals
 */
export function agrees(
  node: unknown,
  literals: readonly RootLiteral[],
): boolean {
  for (const literal of literals) {
    if (!admits(literal, valueAt(node, literal.path))) return false
  }

  return true
}
