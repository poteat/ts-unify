import type { ChainPlan } from './chain-plan'

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
