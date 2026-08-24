import { brandStringPredicate } from './brand-string-predicate'
import type { StringPredicate } from './string-predicate'
import { testString } from './test-string'

/**
 * Negate a string predicate. Like every predicate, `false` for a non-string.
 *
 * @example
 * U.Identifier({ name: U.string.not(U.string.reserved()) })
 */
export const not = (predicate: StringPredicate | RegExp): StringPredicate =>
  brandStringPredicate(value => !testString(predicate, value))
