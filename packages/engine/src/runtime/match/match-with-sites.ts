import type { ChainEntry } from '@ts-unify/core/internal'

import Literals from './literals'
import { matchAdmitted } from './match-admitted'
import type { MatchResult } from './match-result'

/**
 * Matches an AST node against a pattern and returns the capture bag with
 * the inner `.to()` rewrite sites, or null on mismatch.
 *
 * The pattern's root literals are read off the node first: a node missing
 * one is a mismatch before a context is made for it. The match itself is
 * `matchAdmitted`, whose sites and root bag it describes.
 *
 * @param node the AST node
 * @param pattern a fields record or a root proxy
 * @param chain the root proxy's chain
 */
export const matchWithSites = (
  node: unknown,
  pattern: unknown,
  chain: ChainEntry[] = [],
): MatchResult | null =>
  Literals.agrees(node, Literals.rootLiteralsOf(pattern))
    ? matchAdmitted(node, pattern, chain)
    : null
