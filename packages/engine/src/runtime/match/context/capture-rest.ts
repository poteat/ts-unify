import type { Bag } from '../bag'
import Node from '../node'
import type { Cursor } from './cursor'

/**
 * The structural properties of a node the pattern did not name, captured
 * under their own names with their paths recorded.
 *
 * Empty for a value that is not an object.
 *
 * @param node the node
 * @param at where the node sits in the match
 * @param named the keys the pattern named
 */
export function captureRest(
  node: unknown,
  at: Cursor,
  named: ReadonlySet<string>,
): Bag {
  const bag: Bag = {}
  if (!node || typeof node !== 'object') return bag

  for (const key of Object.keys(node)) {
    if (!Node.META_KEYS.has(key) && !named.has(key)) {
      bag[key] = (node as Record<string, unknown>)[key]
      at.ctx.capturePaths[key] = [...at.path, key]
    }
  }

  return bag
}
