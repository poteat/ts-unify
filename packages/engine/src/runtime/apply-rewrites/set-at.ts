import type { Path } from '../match'
import { locateParent } from './locate-parent'

/**
 * The tree with a value written at a path, in place; an empty path
 * makes the value the tree, and a path that leaves the tree writes nothing.
 *
 * @param root the tree written into
 * @param path the path written at
 * @param value what is written there
 */
export function setAt(root: unknown, path: Path, value: unknown): unknown {
  if (path.length === 0) return value
  const { parent, key } = locateParent(root, path)

  if (parent && key != null) {
    ;(parent as Record<string | number, unknown>)[key] = value
  }

  return root
}
