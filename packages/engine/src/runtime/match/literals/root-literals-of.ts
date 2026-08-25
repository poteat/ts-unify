import FromPlan from './from-plan'
import Memo from './memo'
import type { RootLiteral } from './types'
/**
 * Every literal a pattern requires under the node it matches, read once
 * per pattern object; a primitive's are read each time.
 *
 * @param pattern the pattern
 */
export const rootLiteralsOf = (pattern: unknown): readonly RootLiteral[] =>
  (typeof pattern === 'object' || typeof pattern === 'function') && pattern
    ? Memo.rootLiterals.of(pattern)
    : FromPlan.buildRootLiterals(pattern)
