import type { ChainEntry } from '@ts-unify/core/internal'

import Plan from '../plan'
import { applyConstraints } from './apply-constraints'

/**
 * Whether a node satisfies every `.where()` entry of a chain.
 *
 * Each entry carries constraint patterns, each with a quantifier and an
 * optional `.until()` boundary; a constraint without a quantifier is
 * skipped.
 *
 * @param chain the chain
 * @param actual the matched node, whose descendants are counted
 */
export const applyWhere = (chain: ChainEntry[], actual: unknown) =>
  applyConstraints(Plan.chainPlanOf(chain).constraints, actual)
