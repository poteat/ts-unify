import FromPlan from './from-plan'
import Memo from './memo'
import type { RootLiteral } from './types'
/**
 * Every literal a pattern requires under the node it matches, read once
 * per pattern object; a primitive's are read each time.
 *
 * @param pattern the pattern
 * @returns the pattern's root literals, memoized for an object or function
 *          pattern
 */
export function rootLiteralsOf(pattern: unknown): readonly RootLiteral[] {
  const isObjectOrFunction =
    (typeof pattern === 'object' || typeof pattern === 'function') &&
    pattern !== null

  return isObjectOrFunction
    ? Memo.rootLiterals.of(pattern)
    : FromPlan.buildRootLiterals(pattern)
}
