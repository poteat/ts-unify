import Brand from './brand'
import type { StringPredicate } from './types'

/**
 * Whether a pattern value is a string predicate, or a `RegExp` standing for
 * one.
 */
export const isStringPredicate = (
  value: unknown,
): value is StringPredicate | RegExp =>
  value instanceof RegExp ||
  (typeof value === 'function' &&
    (value as Partial<StringPredicate>)[Brand.STRING_PREDICATE_BRAND] === true)
