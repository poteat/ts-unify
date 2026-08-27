import { rootLiteralsOf } from '../root-literals-of'

/**
 * A pattern's root literals as `[key, values]` pairs, for a test to
 * compare.
 *
 * @param pattern the pattern
 * @returns a `[key, values]` pair per root literal, in their order
 */
export const keyedValues = (pattern: unknown): (string | unknown[])[][] =>
  rootLiteralsOf(pattern).map(it => [it.key, [...it.values]])
