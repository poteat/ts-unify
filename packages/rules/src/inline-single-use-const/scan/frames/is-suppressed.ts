import type { Site } from './types'

/**
 * Whether a name is among the ones suppressed at a site.
 *
 * @param site where the identifier stands, with the names suppressed there,
 *             innermost first; none at the top
 * @param name the name
 * @returns true when the name is in the site's suppressed chain
 */
export function isSuppressed(site: Site, name: string) {
  for (let at = site.suppressed; at !== null; at = at.up) {
    if (at.name === name) return true
  }

  return false
}
