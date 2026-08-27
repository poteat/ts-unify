import type { StringPredicate } from '@/string-predicate/string-predicate/types'

import Regex from './regex'

/**
 * Apply a string predicate, or the `RegExp` sugar for one, to a matched value.
 */
export function testString(
  predicate: StringPredicate | RegExp,
  actual: unknown,
) {
  const isRegex = predicate instanceof RegExp

  return isRegex ? Regex.regex(predicate)(actual) : predicate(actual)
}
