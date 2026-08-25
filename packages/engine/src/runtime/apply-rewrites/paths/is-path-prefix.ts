import type { Path } from '@engine/runtime/types'
/**
 * Whether one path is a prefix of another, or equal to it.
 *
 * @param prefix the shorter path
 * @param path the path that may start with it
 */
export function isPathPrefix(prefix: Path, path: Path) {
  if (prefix.length > path.length) return false

  for (let i = 0; i < prefix.length; i++) {
    if (prefix[i] !== path[i]) return false
  }

  return true
}
