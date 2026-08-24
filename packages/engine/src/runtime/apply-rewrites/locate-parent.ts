import type { Path } from '../match'
import type { Located } from './located'

/**
 * The container at all but the last segment of a path, and the last
 * segment's key; nulls for an empty path or one that leaves the tree.
 *
 * @param root the tree walked
 * @param path the path into it
 */
export function locateParent(root: unknown, path: Path): Located {
  if (path.length === 0) return { parent: null, key: null }
  let cursor: unknown = root

  for (let i = 0; i < path.length - 1; i++) {
    const seg = path[i]
    cursor = (cursor as Record<string | number, unknown>)[seg as never]
    if (cursor == null) return { parent: null, key: null }
  }

  return {
    parent: cursor as Record<string, unknown> | unknown[],
    key: path[path.length - 1],
  }
}
