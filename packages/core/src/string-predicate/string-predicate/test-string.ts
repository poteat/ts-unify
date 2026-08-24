import { regex } from './regex'
import type { StringPredicate } from './string-predicate'

/**
 * Apply a string predicate, or the `RegExp` sugar for one, to a matched value.
 */
export const testString = (
  predicate: StringPredicate | RegExp,
  actual: unknown,
) =>
  predicate instanceof RegExp ? regex(predicate)(actual) : predicate(actual)
