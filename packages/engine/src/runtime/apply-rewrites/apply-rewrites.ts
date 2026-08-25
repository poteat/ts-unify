import type { RewriteSite } from '@ts-unify/engine/runtime/match'
import Reify from '@ts-unify/engine/runtime/reify'
import type { Path } from '@ts-unify/engine/runtime/types'

import Outside from './outside'
import Paths from './paths'
/**
 * The rewritten copy of a matched node once every inner `.to()` site of
 * the match has run, or null when the match has no sites.
 *
 * Sites run deepest first; a site at the empty path replaces the root,
 * and then no copy is made, as no site reads one. A capture sourced at
 * or under a rewritten position is rebound to the rewrite.
 *
 * @param matchedNode the node the pattern matched; left as it was
 * @param sites the rewrite sites the match recorded
 * @param capturePaths where each named capture was sourced from
 */
export function applyRewrites(
  matchedNode: unknown,
  sites: ReadonlyArray<RewriteSite>,
  capturePaths: Record<string, Path> = {},
): unknown {
  if (sites.length === 0) return null

  /**
   * Deepest first, so an inner rewrite lands before the outer one reads
   * its captures; sibling sites are disjoint, so their order is free.
   */
  const ordered = [...sites].sort((a, b) => b.path.length - a.path.length)
  const rootSite = ordered[ordered.length - 1].path.length === 0
  let root: unknown = rootSite
    ? undefined
    : Outside.cloneOutside(matchedNode, Outside.siteTreeOf(sites))

  for (const site of ordered) {
    const reified = Reify.reify(site.factory(site.scopeBag))

    if (site.path.length === 0) {
      root = reified

      for (const name of Object.keys(capturePaths)) {
        site.scopeBag[name] = reified
      }

      continue
    }

    if (!rootSite) {
      const { parent, key } = Paths.locateParent(root, site.path)

      if (!parent || key == null) continue

      if (Array.isArray(parent) && typeof key === 'number') {
        const items = Array.isArray(reified) ? reified : [reified]
        const after = parent.slice(key + (site.span ?? 1))
        const spliced = [...parent.slice(0, key), ...items, ...after]
        root = Paths.setAt(root, site.path.slice(0, -1), spliced)
      } else {
        root = Paths.setAt(root, site.path, reified)
      }
    }

    if (site.span === undefined || site.span === 1) {
      for (const [name, capPath] of Object.entries(capturePaths)) {
        if (Paths.isPathPrefix(site.path, capPath)) {
          site.scopeBag[name] = reified
        }
      }
    }
  }

  return root
}
