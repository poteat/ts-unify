import type { ChainEntry } from '@ts-unify/core/internal'

import Chain from '../chain'
import type { Path } from '../path'
import type { RewriteSite } from '../rewrite-site'
import type { MatchContext } from './match-context'
import type { NamedBinding } from './named-binding'

/**
 * A fresh context for one match, holding its own sites and bindings.
 *
 * @param chain the root chain, whose `.config()` entry supplies the defaults
 * @param program the root node when it is a `Program`
 */
export function createMatchContext(
  chain: ChainEntry[] = [],
  program: unknown = undefined,
): MatchContext {
  const sites: RewriteSite[] = []
  const namedBindings: NamedBinding[] = []
  const capturePaths: Record<string, Path> = {}

  return {
    sites,
    capturePaths,
    namedBindings,
    configDefaults: Chain.extractConfigDefaults(chain),
    program,
    recordSite: site => sites.push(site),
    bind: (name, value) => namedBindings.push({ name, value }),
  }
}
