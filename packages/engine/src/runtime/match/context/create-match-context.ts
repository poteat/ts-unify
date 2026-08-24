import type { ChainEntry } from '@ts-unify/core/internal'

import Plan from '../plan'
import type { MatchContext } from './match-context'
import { matchContextOf } from './match-context-of'

/**
 * A fresh context for one match, holding its own sites and bindings.
 *
 * @param chain the root chain, whose `.config()` entry supplies the defaults
 * @param program the root node when it is a `Program`
 */
export const createMatchContext = (
  chain: ChainEntry[] = [],
  program: unknown = undefined,
): MatchContext => matchContextOf(Plan.chainPlanOf(chain), program)
