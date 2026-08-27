import type { Path } from '@ts-unify/engine/runtime/types'
/**
 * Whether one path is a prefix of another, or equal to it.
 *
 * @param prefix the shorter path
 * @param path the path that may start with it
 * @returns true when every segment of the prefix equals the path's at that
 *          index
 */
export function isPathPrefix(prefix: Path, path: Path) {
  if (prefix.length > path.length) return false

  for (let i = 0; i < prefix.length; i++) {
    if (prefix[i] !== path[i]) return false
  }

  return true
}
