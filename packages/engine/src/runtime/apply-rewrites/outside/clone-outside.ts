import Sub from '../../sub'
import { cloneNode } from '../clone-node'
import { METADATA_KEYS } from '../metadata-keys'
import type { SiteTree } from './site-tree'

/**
 * A deep copy of an AST node without its `METADATA_KEYS`, the positions
 * of the sites left undefined for their rewrites to fill.
 *
 * The copy `cloneNode` makes, everywhere else.
 *
 * @param node the node copied; arrays and primitives pass through
 * @param sites the positions left unfilled, relative to the node; none
 *   when absent
 */
export function cloneOutside(node: unknown, sites?: SiteTree): unknown {
  if (!sites || sites.size === 0) return cloneNode(node)

  if (Array.isArray(node)) {
    return node.map((item, index) => {
      const below = sites.get(index)

      return below === null ? undefined : cloneOutside(item, below)
    })
  }

  if (Sub.isLeaf(node)) return node
  const copy: Record<string, unknown> = {}

  for (const key of Object.keys(node as Record<string, unknown>)) {
    if (METADATA_KEYS.has(key)) continue
    const below = sites.get(key)
    copy[key] =
      below === null
        ? undefined
        : cloneOutside((node as Record<string, unknown>)[key], below)
  }

  return copy
}
