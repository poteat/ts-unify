import Branding from './branding'
import TestString from './test-string'
import type { StringPredicate } from './types'

/**
 * Negate a string predicate. Like every predicate, `false` for a non-string.
 *
 * @example
 * U.Identifier({ name: U.string.not(U.string.reserved()) })
 */
export const not = (predicate: StringPredicate | RegExp): StringPredicate =>
  Branding.brandStringPredicate(
    value => !TestString.testString(predicate, value),
  )
