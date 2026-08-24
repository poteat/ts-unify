import StringPredicate from '@/string-predicate/string-predicate'

import type { IdentifierNamePredicate } from './identifier-name-predicate'
import { IDENTIFIER_NAME_REGEX } from './identifier-name-regex'

/**
 * A string predicate: the string is an ECMAScript IdentifierName. In a slot,
 * or called on a captured value, which it narrows to `string`.
 *
 * Reserved words are IdentifierNames (a property key may be one); pair with
 * `U.string.reserved` for a binding name.
 *
 * @example
 * U.Property({ key: U.Literal({ value: U.string.identifierName() }) })
 */
export const identifierName = (): IdentifierNamePredicate =>
  StringPredicate.regex(IDENTIFIER_NAME_REGEX) as IdentifierNamePredicate
