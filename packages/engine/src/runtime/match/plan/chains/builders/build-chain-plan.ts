import type { ChainEntry } from '@ts-unify/core/internal'
import Chain from '@ts-unify/engine/runtime/match/chain'
import type { ChainPlan } from '@ts-unify/engine/runtime/match/plan/chains/types'
import Constraints from '@ts-unify/engine/runtime/match/plan/constraints'
import type { RewriteFactory } from '@ts-unify/engine/runtime/match/types'
import type { Bag } from '@ts-unify/engine/runtime/types'

import Binds from './binds'
/**
 * What a chain does to a match, read from its entries.
 *
 * The `.when()` guards, the first `.bind()`, whether it seals, the factory
 * of the first `.to()`, the defaults of the first `.config()`, and the
 * `.where()` constraints.
 *
 * @param chain the chain
 */
export function buildChainPlan(chain: ChainEntry[]): ChainPlan {
  const bindEntry = Chain.chainGet(chain, 'bind')
  const toEntry = Chain.chainGet(chain, 'to')

  return {
    whens: chain.flatMap(e =>
      e.method === 'when' && typeof e.args[0] === 'function'
        ? [e.args[0] as (bag: Bag) => unknown]
        : [],
    ),

    bind: bindEntry ? Binds.bindPlanOf(bindEntry) : null,
    seal: Chain.chainHas(chain, 'seal'),

    factory:
      toEntry &&
      ((toEntry.args[0] as RewriteFactory | undefined) ??
        ((bag: Bag) => Object.values(bag)[0])),

    configDefaults: Chain.extractConfigDefaults(chain),
    constraints: Constraints.constraintPlansOf(chain),
  }
}
