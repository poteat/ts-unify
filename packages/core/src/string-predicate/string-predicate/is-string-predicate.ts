import type { StringPredicate } from './string-predicate'
import { STRING_PREDICATE_BRAND } from './string-predicate-brand'

/**
 * Whether a pattern value is a string predicate, or a `RegExp` standing for
 * one.
 */
export const isStringPredicate = (
  value: unknown,
): value is StringPredicate | RegExp =>
  value instanceof RegExp ||
  (typeof value === 'function' &&
    (value as Partial<StringPredicate>)[STRING_PREDICATE_BRAND] === true)
