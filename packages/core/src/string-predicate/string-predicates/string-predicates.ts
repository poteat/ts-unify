import IdentifierName from '@/string-predicate/identifier-name'
import Reserved from '@/string-predicate/reserved'
import StringPredicate from '@/string-predicate/string-predicate'

/**
 * The string predicates, exposed as `U.string`. Each is usable in a string
 * position of a pattern and callable on a captured value.
 */
export const stringPredicates = {
  regex: StringPredicate.regex,
  not: StringPredicate.not,
  reserved: Reserved.reserved,
  identifierName: IdentifierName.identifierName,
} as const

export type StringPredicates = typeof stringPredicates
