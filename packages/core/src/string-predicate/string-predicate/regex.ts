import { brandStringPredicate } from './brand-string-predicate'
import type { StringPredicate } from './string-predicate'

/**
 * A string predicate from a `RegExp`; a bare `RegExp` in a string position
 * is sugar for this.
 *
 * The expression's `lastIndex` is reset before each test, so a global or
 * sticky flag does not make the second match differ from the first.
 *
 * @example
 * U.Comment({ text: U.string.regex(/TODO/) })
 */
export const regex = (expression: RegExp): StringPredicate =>
  brandStringPredicate(value => {
    expression.lastIndex = 0

    return expression.test(value)
  })
