/**
 * Enumerable key that `{ ...$ }` copies into a pattern object, telling the
 * matcher to capture the properties the pattern leaves unmatched.
 */
export const REST_CAPTURE = Symbol.for('ts-unify.rest-capture')
