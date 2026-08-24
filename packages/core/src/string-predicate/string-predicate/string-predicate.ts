/**
 * Brand on a predicate accepted in a pattern's string position.
 */
export const STRING_PREDICATE_BRAND: unique symbol = Symbol.for(
  'ts-unify.string-predicate',
)

/**
 * A string predicate: callable on any value, `false` for a non-string, and
 * accepted in a string position of a pattern where it tests the string and
 * captures nothing. Build one with {@link stringPredicate}.
 */
export type StringPredicate = ((value: unknown) => boolean) & {
  readonly [STRING_PREDICATE_BRAND]: true
}

/**
 * Brand a test over strings as a string predicate.
 *
 * @param test Predicate over a string; never sees a non-string.
 * @example
 * const long = stringPredicate((s) => s.length > 20);
 * U.Identifier({ name: long });   // in a slot
 * long(bag.name);                 // on a captured value
 */
export const stringPredicate = (
  test: (value: string) => boolean,
): StringPredicate =>
  Object.assign((value: unknown) => typeof value === 'string' && test(value), {
    [STRING_PREDICATE_BRAND]: true as const,
  })

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

/**
 * A string predicate from a `RegExp`. A bare `RegExp` in a string position is
 * sugar for this. The expression's `lastIndex` is reset before each test, so
 * a global or sticky flag does not make the second match differ from the first.
 *
 * @example
 * U.Comment({ text: U.string.regex(/TODO/) })   // same as { text: /TODO/ }
 */
export const regex = (expression: RegExp): StringPredicate =>
  stringPredicate(value => {
    expression.lastIndex = 0

    return expression.test(value)
  })

/**
 * Apply a string predicate, or the `RegExp` sugar for one, to a matched value.
 */
export const testString = (
  predicate: StringPredicate | RegExp,
  actual: unknown,
) =>
  predicate instanceof RegExp ? regex(predicate)(actual) : predicate(actual)

/**
 * Negate a string predicate. Like every predicate, `false` for a non-string.
 *
 * @example
 * U.Identifier({ name: U.string.not(U.string.reserved()) })
 */
export const not = (predicate: StringPredicate | RegExp): StringPredicate =>
  stringPredicate(value => !testString(predicate, value))
