import { buildRootLiterals } from './build-root-literals'
import type { RootLiteral } from './root-literal'
import { rootLiterals } from './root-literals'

/**
 * Every literal a pattern requires under the node it matches, read once
 * per pattern object; a primitive's are read each time.
 *
 * @param pattern the pattern
 */
export const rootLiteralsOf = (pattern: unknown): readonly RootLiteral[] =>
  (typeof pattern === 'object' || typeof pattern === 'function') && pattern
    ? rootLiterals.of(pattern)
    : buildRootLiterals(pattern)
