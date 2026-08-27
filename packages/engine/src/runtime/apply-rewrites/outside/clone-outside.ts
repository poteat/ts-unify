import Clones from '@ts-unify/engine/runtime/apply-rewrites/clones'
import Util from '@ts-unify/engine/runtime/apply-rewrites/util'
import Sub from '@ts-unify/engine/runtime/sub'

import type { SiteTree } from './types'
/**
 * A deep copy of an AST node without its `METADATA_KEYS`, the positions
 * of the sites left undefined for their rewrites to fill.
 *
 * The copy `cloneNode` makes, everywhere else.
 *
 * @param node the node copied; arrays and primitives pass through
 * @param sites the positions left unfilled, relative to the node; none
 *   when absent
 * @returns the copy with undefined at each site position, or `cloneNode`'s copy
 *          when no sites are given
 */
export function cloneOutside(node: unknown, sites?: SiteTree): unknown {
  if (!sites || sites.size === 0) return Clones.cloneNode(node)

  if (Array.isArray(node)) {
    return node.map((item, index) => {
      const below = sites.get(index)

      return below === null ? undefined : cloneOutside(item, below)
    })
  }

  if (Sub.isLeaf(node)) return node
  const copy: Record<string, unknown> = {}

  for (const key of Object.keys(node as Record<string, unknown>)) {
    if (Util.METADATA_KEYS.has(key)) continue
    const below = sites.get(key)
    copy[key] =
      below === null
        ? undefined
        : cloneOutside((node as Record<string, unknown>)[key], below)
  }

  return copy
}
