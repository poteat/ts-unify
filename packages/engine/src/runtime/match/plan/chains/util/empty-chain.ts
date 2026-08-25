import type { ChainPlan } from '@engine/runtime/match/plan/chains/types'
/**
 * The plan of an empty chain: no guards, no modifiers, no rewrite, no
 * defaults, no constraints.
 */
export const EMPTY_CHAIN: ChainPlan = {
  whens: [],
  bind: null,
  seal: false,
  factory: undefined,
  configDefaults: {},
  constraints: [],
}
