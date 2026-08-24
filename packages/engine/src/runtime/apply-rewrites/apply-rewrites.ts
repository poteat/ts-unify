import type { Path, RewriteSite } from '../match'
import Reify from '../reify'
import { cloneNode } from './clone-node'
import { isPathPrefix } from './is-path-prefix'
import { locateParent } from './locate-parent'
import { setAt } from './set-at'

/**
 * The rewritten copy of a matched node once every inner `.to()` site of
 * the match has run, or null when the match has no sites.
 *
 * Sites run deepest first, and a site at the empty path replaces the
 * root. A capture sourced at or under a rewritten position is rebound to
 * the rewrite, so an outer factory reads the inner result.
 *
 * @param matchedNode the node the pattern matched; left as it was
 * @param sites the rewrite sites the match recorded
 * @param capturePaths where each named capture was sourced from
 * @param sourceCode a source handle, handed on to `reify` and not yet read
 */
export function applyRewrites(
  matchedNode: unknown,
  sites: ReadonlyArray<RewriteSite>,
  capturePaths: Record<string, Path> = {},
  sourceCode?: unknown,
): unknown {
  if (sites.length === 0) return null

  let root: unknown = cloneNode(matchedNode)

  /**
   * Deepest first, so an inner rewrite lands before the outer one reads
   * its captures; sibling sites are disjoint, so their order is free.
   */
  const ordered = [...sites].sort((a, b) => b.path.length - a.path.length)

  for (const site of ordered) {
    const reified = Reify.reify(site.factory(site.scopeBag), sourceCode)

    if (site.path.length === 0) {
      root = reified

      for (const name of Object.keys(capturePaths)) {
        site.scopeBag[name] = reified
      }

      continue
    }

    const { parent, key } = locateParent(root, site.path)

    if (!parent || key == null) continue

    if (Array.isArray(parent) && typeof key === 'number') {
      const items = Array.isArray(reified) ? reified : [reified]
      const after = parent.slice(key + (site.span ?? 1))
      const spliced = [...parent.slice(0, key), ...items, ...after]
      root = setAt(root, site.path.slice(0, -1), spliced)
    } else {
      root = setAt(root, site.path, reified)
    }

    if (site.span === undefined || site.span === 1) {
      for (const [name, capPath] of Object.entries(capturePaths)) {
        if (isPathPrefix(site.path, capPath)) {
          site.scopeBag[name] = reified
        }
      }
    }
  }

  return root
}
