import Brand from '@/string-predicate/string-predicate/brand'
import type { StringPredicate } from '@/string-predicate/string-predicate/types'

/**
 * Brand a test over strings as a string predicate.
 *
 * @param test Predicate over a string; never sees a non-string.
 * @example
 * const long = brandStringPredicate((s) => s.length > 20);
 */
export const brandStringPredicate = (
  test: (value: string) => boolean,
): StringPredicate =>
  Object.assign((value: unknown) => typeof value === 'string' && test(value), {
    [Brand.STRING_PREDICATE_BRAND]: true as const,
  })
