import type {
  MatchContext,
  NamedBinding,
} from '@ts-unify/engine/runtime/match/context/types'
import type { ChainPlan } from '@ts-unify/engine/runtime/match/plan'
import type { RewriteSite } from '@ts-unify/engine/runtime/match/types'
import type { Path } from '@ts-unify/engine/runtime/types'
/**
 * A fresh context for one match, holding its own sites and bindings.
 *
 * @param chain the root chain's plan, whose config defaults the match reads
 * @param program the root node when it is a `Program`
 * @returns a context with empty sites, bindings and capture paths, holding the
 *          plan's config defaults and the program
 */
export function matchContextOf(
  chain: ChainPlan,
  program: unknown,
): MatchContext {
  const sites: RewriteSite[] = []
  const namedBindings: NamedBinding[] = []
  const capturePaths: Record<string, Path> = {}

  return {
    sites,
    capturePaths,
    namedBindings,
    configDefaults: chain.configDefaults,
    program,
    recordSite: site => sites.push(site),
    bind: (name, value) => namedBindings.push({ name, value }),
  }
}
