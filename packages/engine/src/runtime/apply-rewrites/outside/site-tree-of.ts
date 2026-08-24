import type { RewriteSite } from '../../match'
import type { SiteTree } from './site-tree'

/**
 * The tree of the positions the inner sites replace; a site under another
 * site's position adds nothing, that position being replaced whole.
 *
 * @param sites the rewrite sites, the root site among them ignored
 */
export function siteTreeOf(sites: ReadonlyArray<RewriteSite>): SiteTree {
  const tree: SiteTree = new Map()

  for (const site of sites) {
    if (site.path.length === 0) continue
    let at = tree
    let cut = false

    for (let i = 0; i < site.path.length - 1 && !cut; i++) {
      const seg = site.path[i]
      const below = at.get(seg)

      if (below === null) {
        cut = true
      } else if (below) {
        at = below
      } else {
        const next: SiteTree = new Map()
        at.set(seg, next)
        at = next
      }
    }

    if (!cut) at.set(site.path[site.path.length - 1], null)
  }

  return tree
}
