import { STRING_PREDICATE_BRAND } from './string-predicate-brand'

/**
 * Callable on any value, `false` for a non-string, and accepted in a string
 * position of a pattern, where it tests the string and captures nothing.
 *
 * Build one with {@link brandStringPredicate}.
 */
export type StringPredicate = ((value: unknown) => boolean) & {
  readonly [STRING_PREDICATE_BRAND]: true
}
