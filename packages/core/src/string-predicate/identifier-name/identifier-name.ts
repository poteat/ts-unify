import StringPredicate from '@/string-predicate/string-predicate'

const IDENTIFIER_NAME = /^[\p{ID_Start}$_][\p{ID_Continue}$‌‍]*$/u

/**
 * The identifierName predicate narrows its argument to `string` when true.
 */
export type IdentifierNamePredicate = ((value: unknown) => value is string) &
  StringPredicate.StringPredicate

/**
 * A string predicate: the string is an ECMAScript IdentifierName, an
 * ID_Start, `$` or `_` followed by ID_Continue, `$`, ZWNJ or ZWJ characters.
 * Usable in a pattern slot or called on a captured value, where it narrows
 * the value to `string`.
 *
 * Reserved words are IdentifierNames (a property key may be one); pair with
 * `U.string.reserved` for a binding name.
 *
 * @example
 * U.Property({ key: U.Literal({ value: U.string.identifierName() }) })
 * U.string.identifierName()("fooBar")    // true
 * U.string.identifierName()("class")     // true
 * U.string.identifierName()("foo-bar")   // false
 */
export const identifierName = (): IdentifierNamePredicate =>
  StringPredicate.stringPredicate(value =>
    IDENTIFIER_NAME.test(value),
  ) as IdentifierNamePredicate
