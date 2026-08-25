import type { Bag } from '@engine/runtime/types'
import type { ChainEntry } from '@ts-unify/core/internal'

import WithSites from './with-sites'
/**
 * Matches an AST node against a pattern and returns its captures, or null
 * on mismatch.
 *
 * The pattern may be a fields record or a root proxy such as
 * `U.Identifier({ name: $ })`. For the inner `.to()` rewrite sites, use
 * {@link matchWithSites}.
 *
 * @param node the AST node
 * @param pattern the pattern
 * @param chain the root proxy's chain, whose `.when()`, `.where()` and
 * `.config()` entries apply
 */
export function match(
  node: unknown,
  pattern: unknown,
  chain?: ChainEntry[],
): Bag | null {
  const result = WithSites.matchWithSites(node, pattern, chain)

  return result?.bag ?? null
}
