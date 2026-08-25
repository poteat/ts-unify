import type { StringPredicate } from '@/string-predicate/string-predicate/types'

import Regex from './regex'

/**
 * Apply a string predicate, or the `RegExp` sugar for one, to a matched value.
 */
export const testString = (
  predicate: StringPredicate | RegExp,
  actual: unknown,
) =>
  predicate instanceof RegExp
    ? Regex.regex(predicate)(actual)
    : predicate(actual)
